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
  const drawBlob = (x: number, y: number, radX: number, radY: number) => {
    ctx.beginPath();
    ctx.ellipse(x, y, radX, radY, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  // Very rough approximation of continents using equirectangular blobs
  drawBlob(width * 0.2, height * 0.3, width * 0.15, height * 0.2); // N. America
  drawBlob(width * 0.3, height * 0.6, width * 0.08, height * 0.2); // S. America
  drawBlob(width * 0.5, height * 0.4, width * 0.1, height * 0.25); // Africa
  drawBlob(width * 0.55, height * 0.2, width * 0.15, height * 0.1); // Europe
  drawBlob(width * 0.75, height * 0.25, width * 0.2, height * 0.2); // Asia
  drawBlob(width * 0.85, height * 0.7, width * 0.1, height * 0.1); // Australia

  // Random noise to break it up
  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 20, 0, Math.PI * 2);
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

  const destinationData: Record<string, { label: string; src: string; size?: 'small' | 'medium' | 'large' }[]> = {
    "GUJARAT": [
      { label: "White Desert", src: "https://images.unsplash.com/photo-1642841819300-20ed449c02a1?q=80&w=1200", size: "large" },
      { label: "Statue of Unity", src: "https://images.unsplash.com/photo-1598886367332-90f7d468eb37?q=80&w=1200", size: "small" },
      { label: "Sun Temple", src: "https://images.unsplash.com/photo-1620202636709-1bb62b4293c3?q=80&w=1200", size: "medium" },
      { label: "Sasan Gir", src: "https://images.unsplash.com/photo-1594895697620-e2609026210f?q=80&w=1200", size: "small" },
    ],
    "RAJASTHAN": [
      { label: "Hawa Mahal", src: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200", size: "medium" },
      { label: "City Palace", src: "https://images.unsplash.com/photo-1602643163983-ed0babc39797?q=80&w=1200", size: "large" },
      { label: "Blue City", src: "https://images.unsplash.com/photo-1545063050-022e24748107?q=80&w=1200", size: "small" },
      { label: "Camel Safari", src: "https://images.unsplash.com/photo-1524443169398-9aa1ceab67d5?q=80&w=1200", size: "medium" },
    ],
    "KASHMIR": [
      { label: "Dal Lake", src: "https://images.unsplash.com/photo-1566133062031-619961445b17?q=80&w=1000", size: "large" },
      { label: "Gulmarg", src: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1000", size: "medium" },
      { label: "Pahalgam", src: "https://images.unsplash.com/photo-1617653202545-931490e8d5e6?q=80&w=1000", size: "small" },
      { label: "Srinagar", src: "https://images.unsplash.com/photo-1595180439401-49911e031eb0?q=80&w=1000", size: "medium" },
    ],
    "GOA": [
      { label: "Palolem", src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000", size: "large" },
      { label: "Old Goa", src: "https://images.unsplash.com/photo-1627894483216-2138af692e27?q=80&w=1000", size: "medium" },
      { label: "Panjim", src: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=1000", size: "small" },
      { label: "Baga Beach", src: "https://images.unsplash.com/photo-1590393257545-7164ff5f040c?q=80&w=1000", size: "medium" },
    ],
    "KERALA": [
      { label: "Munnar", src: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=1000", size: "large" },
      { label: "Alleppey", src: "https://images.unsplash.com/photo-1560946272-901b0f555c8c?q=80&w=1000", size: "medium" },
      { label: "Thekkady", src: "https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?q=80&w=1000", size: "small" },
      { label: "Varkala", src: "https://images.unsplash.com/photo-1544256603-9d41399cc948?q=80&w=1000", size: "medium" },
    ],
    "DUBAI": [
      { label: "Burj Khalifa", src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000", size: "large" },
      { label: "Desert Safari", src: "https://images.unsplash.com/photo-1454496406107-dc34337da8d6?q=80&w=1000", size: "medium" },
      { label: "Palm Jumeirah", src: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=1000", size: "small" },
      { label: "Dubai Marina", src: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1000", size: "medium" },
    ],
    "LADAKH": [
      { label: "Pangong Lake", src: "https://images.unsplash.com/photo-1581792375021-95561168dbec?q=80&w=1000", size: "large" },
      { label: "Leh Palace", src: "https://images.unsplash.com/photo-1589136777353-0667b14061a9?q=80&w=1000", size: "medium" },
      { label: "Nubra Valley", src: "https://images.unsplash.com/photo-1632724441457-3a9d94942d76?q=80&w=1000", size: "small" },
      { label: "Zanskar", src: "https://images.unsplash.com/photo-1626244473859-9943586cd105?q=80&w=1000", size: "medium" },
    ],
    "JAPAN": [
      { label: "Mount Fuji", src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000", size: "large" },
      { label: "Kyoto", src: "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?q=80&w=1000", size: "medium" },
      { label: "Tokyo", src: "https://images.unsplash.com/photo-1540959733332-e946670b2497?q=80&w=1000", size: "medium" },
      { label: "Osaka", src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000", size: "small" },
    ],
    "SWITZERLAND": [
      { label: "Matterhorn", src: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=1000", size: "large" },
      { label: "Lucerne", src: "https://images.unsplash.com/photo-1514946379532-90281f815889?q=80&w=1000", size: "medium" },
      { label: "Interlaken", src: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1000", size: "medium" },
      { label: "Geneva", src: "https://images.unsplash.com/photo-1582200827299-bb6e42b2605f?q=80&w=1000", size: "small" },
    ],
    "THAILAND": [
      { label: "Phuket", src: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1000", size: "large" },
      { label: "Bangkok", src: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=1000", size: "medium" },
      { label: "Koh Samui", src: "https://images.unsplash.com/photo-1537953391640-dabc20b784ae?q=80&w=1000", size: "small" },
      { label: "Chiang Mai", src: "https://images.unsplash.com/photo-1511252060103-62c79fbe618d?q=80&w=1000", size: "medium" },
    ],
    "INDONESIA": [
      { label: "Uluwatu", src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000", size: "large" },
      { label: "Nusa Penida", src: "https://images.unsplash.com/photo-1537953391640-dabc20b784ae?q=80&w=1000", size: "medium" },
      { label: "Ubud", src: "https://images.unsplash.com/photo-1559628129-67cf63b72248?q=80&w=1000", size: "small" },
      { label: "Lombok", src: "https://images.unsplash.com/photo-1526462988118-24329d592671?q=80&w=1000", size: "medium" },
    ],
    "MALDIVES": [
      { label: "Bungalows", src: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000", size: "large" },
      { label: "Crystal Clear", src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1000", size: "medium" },
      { label: "Resorts", src: "https://images.unsplash.com/photo-1573843507019-1ad8856a4221?q=80&w=1000", size: "small" },
      { label: "Aerial", src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1000", size: "medium" },
    ],
    "ANDAMAN": [
      { label: "Radhanagar", src: "https://images.unsplash.com/photo-1589982424001-381a17684074?q=80&w=1000", size: "large" },
      { label: "Havelock", src: "https://images.unsplash.com/photo-1621644788329-8664ec55447b?q=80&w=1000", size: "medium" },
      { label: "Coral Reefs", src: "https://images.unsplash.com/photo-1546500840-ae38253aba9b?q=80&w=1000", size: "small" },
      { label: "Neil Island", src: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1000", size: "medium" },
    ],
    "AUSTRALIA": [
      { label: "Opera House", src: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000", size: "large" },
      { label: "Twelve Apostles", src: "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=1000", size: "medium" },
      { label: "Bondi Beach", src: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?q=80&w=1000", size: "small" },
      { label: "Blue Mountains", src: "https://images.unsplash.com/photo-1516905041604-7935af78f572?q=80&w=1000", size: "medium" },
    ],
    "FRANCE": [
      { label: "Eiffel Tower", src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000", size: "large" },
      { label: "Nice", src: "https://images.unsplash.com/photo-1533619043865-1c2e2f32ff2f?q=80&w=1000", size: "medium" },
      { label: "Louvre", src: "https://images.unsplash.com/photo-1499856871958-5b964756598a?q=80&w=1000", size: "small" },
      { label: "Provence", src: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=1000", size: "medium" },
    ],
    "HIMACHAL": [
      { label: "Rohtang Pass", src: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000", size: "large" },
      { label: "Shimla", src: "https://images.unsplash.com/photo-1597041066672-4fd6520f91b4?q=80&w=1000", size: "medium" },
      { label: "Manali", src: "https://images.unsplash.com/photo-159981881ef03-6f8e7189196b?q=80&w=1000", size: "small" },
      { label: "Spiti Valley", src: "https://images.unsplash.com/photo-1571536802811-2d9f8e2fa1de?q=80&w=1000", size: "medium" },
    ],
    "ITALY": [
      { label: "Colosseum", src: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000", size: "large" },
      { label: "Venice", src: "https://images.unsplash.com/photo-1514890547357-a9ee2887a35f?q=80&w=1000", size: "medium" },
      { label: "Florence", src: "https://images.unsplash.com/photo-1541123356219-284ebe98ae3b?q=80&w=1000", size: "small" },
      { label: "Amalfi Coast", src: "https://images.unsplash.com/photo-1533903345306-15d1c30952de?q=80&w=1000", size: "medium" },
    ],
    "LONDON": [
      { label: "Big Ben", src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000", size: "large" },
      { label: "London Eye", src: "https://images.unsplash.com/photo-1505761671935-60b3a74239ad?q=80&w=1000", size: "medium" },
      { label: "Tower Bridge", src: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1000", size: "small" },
      { label: "Westminster", src: "https://images.unsplash.com/photo-1503780099440-26af4544d82c?q=80&w=1000", size: "medium" },
    ],
    "MEGHALAYA": [
      { label: "Root Bridge", src: "https://images.unsplash.com/photo-1500353391642-d811867c4ec2?q=80&w=1000", size: "large" },
      { label: "Cherrapunji", src: "https://images.unsplash.com/photo-1621513506301-446777db287c?q=80&w=1000", size: "medium" },
      { label: "Dawki Lake", src: "https://images.unsplash.com/photo-1594911775051-572793260790?q=80&w=1000", size: "small" },
      { label: "Shillong", src: "https://images.unsplash.com/photo-1623190847253-8b7760975662?q=80&w=1000", size: "medium" },
    ],
    "MADHYA PRADESH": [
      { label: "Khajuraho", src: "https://images.unsplash.com/photo-1614713735105-01ce7a7df427?q=80&w=1000", size: "large" },
      { label: "Gwalior Fort", src: "https://images.unsplash.com/photo-1627581179612-45e3f429671f?q=80&w=1000", size: "medium" },
      { label: "Pachmarhi", src: "https://images.unsplash.com/photo-1622312644265-06a06141a027?q=80&w=1000", size: "small" },
      { label: "Bhedaghat", src: "https://images.unsplash.com/photo-1624447385906-9943586cd105?q=80&w=1000", size: "medium" },
    ],
    "SIKKIM": [
      { label: "Tsomgo Lake", src: "https://images.unsplash.com/photo-1582236371537-f06720042468?q=80&w=1000", size: "large" },
      { label: "Gangtok", src: "https://images.unsplash.com/photo-1616053073741-9dc55f307374?q=80&w=1000", size: "medium" },
      { label: "Yumthang", src: "https://images.unsplash.com/photo-1621252060103-62c79fbe618d?q=80&w=1000", size: "small" },
      { label: "Rumtek", src: "https://images.unsplash.com/photo-1626244473859-9943586cd105?q=80&w=1000", size: "medium" },
    ],
    "SINGAPORE": [
      { label: "Marina Bay", src: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000", size: "large" },
      { label: "Gardens By The Bay", src: "https://images.unsplash.com/photo-1506351466238-da15f3cb931a?q=80&w=1000", size: "medium" },
      { label: "Jewel Changi", src: "https://images.unsplash.com/photo-1549280145-bf2d09bb097d?q=80&w=1000", size: "small" },
      { label: "Sentosa", src: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=1000", size: "medium" },
    ],
    "UTTAR PRADESH": [
      { label: "Taj Mahal", src: "https://images.unsplash.com/photo-1564507592333-c60657451dd6?q=80&w=1000", size: "large" },
      { label: "Varanasi Ghats", src: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1000", size: "medium" },
      { label: "Agra Fort", src: "https://images.unsplash.com/photo-1545105511-944f77d667fb?q=80&w=1000", size: "small" },
      { label: "Lucknow", src: "https://images.unsplash.com/photo-1621644788329-8664ec55447b?q=80&w=1000", size: "medium" },
    ],
    "VIETNAM": [
      { label: "Ha Long Bay", src: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000", size: "large" },
      { label: "Da Nang", src: "https://images.unsplash.com/photo-1559592443-7f87a2246961?q=80&w=1000", size: "medium" },
      { label: "Hoi An", src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000", size: "small" },
      { label: "Phu Quoc", src: "https://images.unsplash.com/photo-1559592443-7f87a2246961?q=80&w=1000", size: "medium" },
    ],
  };

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

      {/* Floating Showcase Cards */}
      {focusOn && destinationData[searchQuery.toUpperCase()] && (
        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
          {/* Left Cards */}
          <div className="absolute left-[2vw] lg:left-[4vw] top-1/2 -translate-y-1/2 flex flex-col gap-16 items-start">
            {destinationData[searchQuery.toUpperCase()].slice(0, 2).map((item: any, i: number) => {
              const isFirst = i === 0;
              return (
                <div
                  key={i}
                  className={`
                    ${isFirst 
                      ? 'w-64 h-48 md:w-[26rem] md:h-64 xl:w-[32rem] xl:h-80 -rotate-1' 
                      : 'w-48 h-64 md:w-64 md:h-[28rem] xl:w-80 xl:h-[34rem] rotate-2 translate-x-12'}
                    rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] animate-fade-up pointer-events-auto group cursor-pointer 
                    relative transition-all duration-1000 hover:scale-[1.05] hover:border-white/40 hover:rotate-0 active:scale-95
                  `}
                  style={{ animationDelay: `${i * 0.3 + 0.6}s`, opacity: 0 }}
                  onClick={() => {
                    if (searchQuery.toUpperCase() === "GUJARAT") { window.location.href = "/gujarat"; }
                  }}
                >
                  <img src={item.src} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-base md:text-xl xl:text-3xl font-extralight tracking-[0.4em] uppercase mb-2">{item.label}</h3>
                    <div className="h-[2px] w-0 group-hover:w-full bg-white/60 transition-all duration-1000" />
                    <p className="text-white/40 text-xs uppercase tracking-[0.3em] mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">Experience the magic</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Cards */}
          <div className="absolute right-[2vw] lg:right-[4vw] top-1/2 -translate-y-1/2 flex flex-col gap-16 items-end">
            {destinationData[searchQuery.toUpperCase()].slice(2, 4).map((item: any, i: number) => {
              const isFirst = i === 0;
              return (
                <div
                  key={i}
                  className={`
                    ${isFirst 
                      ? 'w-56 h-56 md:w-72 md:h-72 xl:w-[22rem] xl:h-[22rem] rotate-3 -translate-x-8' 
                      : 'w-64 h-44 md:w-[24rem] md:h-56 xl:w-[28rem] xl:h-64 -rotate-2'}
                    rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] animate-fade-up pointer-events-auto group cursor-pointer
                    relative transition-all duration-1000 hover:scale-[1.05] hover:border-white/40 hover:rotate-0 active:scale-95
                  `}
                  style={{ animationDelay: `${i * 0.3 + 1.2}s`, opacity: 0 }}
                  onClick={() => {
                    if (searchQuery.toUpperCase() === "GUJARAT") { window.location.href = "/gujarat"; }
                  }}
                >
                  <img src={item.src} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-base md:text-xl xl:text-3xl font-extralight tracking-[0.4em] uppercase mb-2">{item.label}</h3>
                    <div className="h-[2px] w-0 group-hover:w-full bg-white/60 transition-all duration-1000" />
                    <p className="text-white/40 text-xs uppercase tracking-[0.3em] mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">Experience the magic</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
