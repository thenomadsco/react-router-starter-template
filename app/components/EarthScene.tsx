import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- SHADERS ---

const globeVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const globeFragmentShader = `
  uniform vec3 color;
  uniform vec3 rimColor;
  uniform float rimPower;
  uniform float rimIntensity;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float rim = 1.0 - max(0.0, dot(normal, viewDir));
    rim = pow(rim, rimPower) * rimIntensity;
    vec3 finalColor = color + rimColor * rim;
    gl_FragColor = vec4(finalColor, 1.0);
    #include <colorspace_fragment>
  }
`;

const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 color;
  uniform float power;
  uniform float coefficient;
  uniform float intensity;
  varying vec3 vNormal;
  void main() {
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float viewDot = dot(vNormal, viewDir);
    float factor = pow(max(0.0, coefficient - viewDot), power);
    vec3 finalColor = color * factor * intensity;
    gl_FragColor = vec4(finalColor, factor * intensity);
    #include <colorspace_fragment>
  }
`;

// --- HELPERS ---

const DEG2RAD = Math.PI / 180;
function lonLatToCartesian(lon: number, lat: number, r: number) {
  const lonRad = lon * DEG2RAD;
  const latRad = lat * DEG2RAD;
  const y = r * Math.sin(latRad);
  const rXZ = r * Math.cos(latRad);
  const x = rXZ * Math.sin(lonRad);
  const z = rXZ * Math.cos(lonRad);
  return { x, y, z };
}

// Generate an internal pseudo-map so we don't rely on external texture CORS
function generateLandMapData(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  
  // Fill ocean (black = no land points)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  
  // Draw continents manually as blobs
  ctx.fillStyle = '#ffffff'; // White = land points
  const drawBlob = (x:number, y:number, radX:number, radY:number) => {
    ctx.beginPath();
    ctx.ellipse(x, y, radX, radY, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  
  // Very rough approximation of continents using equirectangular blobs
  drawBlob(width*0.2, height*0.3, width*0.15, height*0.2); // N. America
  drawBlob(width*0.3, height*0.6, width*0.08, height*0.2); // S. America
  drawBlob(width*0.5, height*0.4, width*0.1, height*0.25); // Africa
  drawBlob(width*0.55, height*0.2, width*0.15, height*0.1); // Europe
  drawBlob(width*0.75, height*0.25, width*0.2, height*0.2); // Asia
  drawBlob(width*0.85, height*0.7, width*0.1, height*0.1); // Australia
  
  // Random noise to break it up
  for(let i=0; i<1000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 20, 0, Math.PI*2);
    ctx.fill();
  }
  
  return ctx.getImageData(0, 0, width, height);
}

const LAND_MASK_THRESHOLD = 0.5;

function fract(value: number) { return value - Math.floor(value); }

function pointToMaskUV(x: number, y: number, z: number) {
  const length = Math.sqrt(x * x + y * y + z * z);
  if (length === 0) return { u: 0, v: 0 };
  const nx = z / length;
  const ny = y / length;
  const nz = -x / length;
  const gPhi = Math.asin(THREE.MathUtils.clamp(ny, -1, 1));
  const cosPhi = Math.cos(gPhi);
  let gTheta = 0;
  if (Math.abs(cosPhi) > 1e-9) {
    const thetaInput = THREE.MathUtils.clamp(-nx / cosPhi, -1, 1);
    gTheta = Math.acos(thetaInput);
    if (nz < 0) gTheta = -gTheta;
  }
  return {
    u: fract((gTheta * 0.5) / Math.PI),
    v: fract(-(gPhi / Math.PI + 0.5)),
  };
}

// --- COMPONENTS ---

const InnerGlobe = ({
  radius = 2,
  pointCount = 20000,
  pointSize = 0.035,
  pointColor = "#4ade80", // Natural green
  globeColor = "#0f172a", // Deep slate blue base
  rimColor = "#3b82f6",   // Bright blue rim
  markers = [],
  focusOn = null
}: any) => {
  const meshRef = useRef<THREE.Group>(null);
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (focusOn) {
      // Focus on specific point smoothly, adapting to the camera's orbital position!
      const targetLon = focusOn[1];
      const targetLat = focusOn[0];
      
      const { x, y, z } = lonLatToCartesian(targetLon, targetLat, 1);
      const markerVec = new THREE.Vector3(x, y, z).normalize();
      
      // Face the camera's current orbital position
      const faceCameraVec = state.camera.position.clone().normalize();
      const targetQuat = new THREE.Quaternion().setFromUnitVectors(markerVec, faceCameraVec);
      
      meshRef.current.quaternion.slerp(targetQuat, 0.05);
    }
  });

  // Setup globe uniforms
  const globeUniforms = useMemo(() => ({
    color: { value: new THREE.Color(globeColor) },
    rimColor: { value: new THREE.Color(rimColor) },
    rimPower: { value: 6.0 },
    rimIntensity: { value: 1.5 },
  }), [globeColor, rimColor]);

  // Setup atmosphere uniforms
  const atmosUniforms = useMemo(() => ({
    color: { value: new THREE.Color(rimColor) },
    power: { value: 12.0 },
    coefficient: { value: 0.9 },
    intensity: { value: 2.0 },
  }), [rimColor]);

  // Generate Points
  const pointPositions = useMemo(() => {
    const landMask = generateLandMapData(1024, 512);
    if (!landMask) return new Float32Array();

    const positions: number[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const surfaceRadius = radius * 1.001;

    for (let i = 0; i < pointCount; i++) {
      const t = pointCount === 1 ? 0.5 : i / (pointCount - 1);
      const y = 1 - 2 * t;
      const radial = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radial;
      const z = Math.sin(theta) * radial;

      const pX = x * surfaceRadius;
      const pY = y * surfaceRadius;
      const pZ = z * surfaceRadius;

      // Sample mask
      const { u, v } = pointToMaskUV(pX, pY, pZ);
      const sx = Math.min(landMask.width - 1, Math.max(0, Math.floor(u * landMask.width)));
      const sy = Math.min(landMask.height - 1, Math.max(0, Math.floor(v * landMask.height)));
      const id = (sy * landMask.width + sx) * 4;
      
      // Check red channel value (0-255)
      if ((landMask.data[id] / 255) >= LAND_MASK_THRESHOLD) {
        positions.push(pX, pY, pZ);
      }
    }
    return new Float32Array(positions);
  }, [radius, pointCount]);

  useEffect(() => {
    if (instancedRef.current && pointPositions.length > 0) {
      const dummy = new THREE.Object3D();
      const count = pointPositions.length / 3;
      for (let i = 0; i < count; i++) {
        const x = pointPositions[i * 3];
        const y = pointPositions[i * 3 + 1];
        const z = pointPositions[i * 3 + 2];
        dummy.position.set(x, y, z);
        dummy.lookAt(x * 2, y * 2, z * 2);
        dummy.updateMatrix();
        instancedRef.current.setMatrixAt(i, dummy.matrix);
      }
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [pointPositions]);

  return (
    <group ref={meshRef}>
      {/* Base Globe */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          vertexShader={globeVertexShader}
          fragmentShader={globeFragmentShader}
          uniforms={globeUniforms}
        />
      </mesh>
      
      {/* Atmosphere Glow */}
      <mesh scale={1.05}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={atmosUniforms}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Points */}
      {pointPositions.length > 0 && (
        <instancedMesh ref={instancedRef} args={[undefined, undefined, pointPositions.length / 3]}>
          <circleGeometry args={[pointSize, 6]} />
          <meshBasicMaterial 
            color={pointColor}
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
            transparent
            opacity={0.8}
            depthWrite={false}
            toneMapped={false}
          />
        </instancedMesh>
      )}

      {/* Markers */}
      {markers.map((marker: any, i: number) => {
        const { x, y, z } = lonLatToCartesian(marker.location[1], marker.location[0], radius * 1.01);
        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <circleGeometry args={[0.08, 24]} />
              <meshBasicMaterial color={marker.color} depthTest={false} depthWrite={false} toneMapped={false} />
            </mesh>
            {focusOn && focusOn[0] === marker.location[0] && focusOn[1] === marker.location[1] && (
              <Html center>
                <div className="pointer-events-none mt-5 rounded-md bg-white/10 backdrop-blur-md px-3 py-1.5 font-mono text-xs font-bold tracking-wider text-white border border-white/20 whitespace-nowrap uppercase shadow-[0_0_15px_rgba(79,183,255,0.5)]">
                  {marker.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};

// Sub-component to manage interactive orbital controls
const InteractionControls = ({ focusOn }: { focusOn: any }) => {
  const controlsRef = useRef<any>(null);

  return (
    <OrbitControls 
      ref={controlsRef} 
      enableZoom={false} 
      enablePan={false} 
      autoRotate={!focusOn} 
      autoRotateSpeed={1.0} 
    />
  );
};

export default function EarthScene() {
  const [isClient, setIsClient] = useState(false);
  const [focusOn, setFocusOn] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const markers = [
    { name: "Andaman", location: [11.7401, 92.6586], color: "#ffffff" },
    { name: "Australia", location: [-25.2744, 133.7751], color: "#ffffff" },
    { name: "France", location: [48.8566, 2.3522], color: "#ffffff" },
    { name: "Goa", location: [15.2993, 74.1240], color: "#ffffff" },
    { name: "Gujarat", location: [22.2587, 71.1924], color: "#ffffff" },
    { name: "Himachal", location: [31.1048, 77.1734], color: "#ffffff" },
    { name: "Indonesia", location: [-0.7893, 113.9213], color: "#ffffff" },
    { name: "Italy", location: [41.8719, 12.5674], color: "#ffffff" },
    { name: "Japan", location: [36.2048, 138.2529], color: "#ffffff" },
    { name: "Kashmir", location: [34.0837, 74.7973], color: "#ffffff" },
    { name: "Kerala", location: [10.8505, 76.2711], color: "#ffffff" },
    { name: "Ladakh", location: [34.1526, 77.5771], color: "#ffffff" },
    { name: "London", location: [51.5074, -0.1278], color: "#ffffff" },
    { name: "Maldives", location: [3.2028, 73.2207], color: "#ffffff" },
    { name: "Meghalaya", location: [25.4670, 91.3662], color: "#ffffff" },
    { name: "Madhya Pradesh", location: [22.9734, 78.6569], color: "#ffffff" },
    { name: "Rajasthan", location: [27.0238, 74.2179], color: "#ffffff" },
    { name: "Sikkim", location: [27.5330, 88.5122], color: "#ffffff" },
    { name: "Singapore", location: [1.3521, 103.8198], color: "#ffffff" },
    { name: "Switzerland", location: [46.8182, 8.2275], color: "#ffffff" },
    { name: "Thailand", location: [15.8700, 100.9925], color: "#ffffff" },
    { name: "Dubai", location: [25.2048, 55.2708], color: "#ffffff" },
    { name: "Uttar Pradesh", location: [26.8467, 80.9462], color: "#ffffff" },
    { name: "Vietnam", location: [14.0583, 108.2772], color: "#ffffff" },
  ];

  const filteredMarkers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    // If the search is empty, or perfectly matches a completed destination (they clicked it recently), show all options.
    const isExactMatch = markers.some(m => m.name.toLowerCase() === query);
    
    if (!query || isExactMatch) return markers;
    return markers.filter(m => m.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleSelect = (m: any) => {
    setFocusOn(m.location);
    setSearchQuery(m.name);
    setShowDropdown(false);
  };

  // 10 second timeout to clear focus and resume rotation
  useEffect(() => {
    if (focusOn) {
      const timer = setTimeout(() => {
        setFocusOn(null);
        setSearchQuery("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [focusOn]);

  // If the user manually clears the search box, instantly resume auto-rotate
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFocusOn(null);
    }
  }, [searchQuery]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden" id="earth-container">
      
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes globeScale {
          0% { opacity: 0; transform: scale(0.9) translateY(40px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-globe {
          animation: globeScale 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.3s; opacity: 0; }
        .stagger-3 { animation-delay: 0.5s; opacity: 0; }
      `}</style>

      {/* Intro Overlay & Search Bar */}
      <div 
        className={`absolute left-0 w-full flex flex-col items-center justify-start z-20 top-[2vh] pointer-events-none`}
      >
        <div className={`flex flex-col items-center mb-4 animate-fade-up stagger-1`}>
          <h1 className="text-white text-4xl md:text-6xl lg:text-[72px] font-thin tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] pointer-events-auto" >
            Nomads Co
          </h1>
        </div>

        <div className="relative w-11/12 max-w-2xl shadow-2xl z-30 pointer-events-auto animate-fade-up stagger-2">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value.toUpperCase());
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="SEARCH DESTINATIONS (E.G. JAPAN)..."
            
            className="w-full bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 rounded-full px-6 py-4 lg:py-4 focus:outline-none focus:border-white/50 transition-colors shadow-inner uppercase tracking-[0.2em] font-light text-xs md:text-sm"
          />
          {/* Dropdown */}
          {showDropdown && searchQuery && (
            <div className="absolute top-full left-0 w-full mt-2 bg-black/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden z-30 max-h-60 overflow-y-auto custom-scrollbar">
              {filteredMarkers.length > 0 ? (
                filteredMarkers.map(m => (
                  <button 
                    key={m.name}
                    onMouseDown={() => handleSelect(m)}
                    
                    className="w-full text-left px-6 py-4 text-white hover:bg-white/10 transition-colors uppercase tracking-[0.2em] font-light text-xs md:text-sm border-b border-white/10 last:border-0"
                  >
                    {m.name}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs tracking-widest uppercase font-light" >
                  No destinations found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3D Canvas Background */}
      <div className="absolute inset-0 w-full h-screen z-0 pointer-events-auto translate-y-[10vh]">
        {isClient && (
          <div className="w-full h-full animate-globe stagger-3">
            <Canvas 
              gl={{ antialias: true, alpha: true }} 
              dpr={[1, 2]} 
              camera={{ position: [0, 0, 7.2], fov: 45 }}
              style={{ background: 'transparent' }}
            >
              <InteractionControls focusOn={focusOn} />
              <InnerGlobe markers={markers} focusOn={focusOn} />
            </Canvas>
          </div>
        )}
      </div>

    </div>
  );
}
