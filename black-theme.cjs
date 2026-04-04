const fs = require('fs');
const path = require('path');

function sanitizeTheme(filePath) {
  const targetFile = path.resolve(__dirname, filePath);
  if (!fs.existsSync(targetFile)) return;
  let content = fs.readFileSync(targetFile, 'utf8');

  // Background replacements
  content = content.replace(/bg-\[\#020617\]/g, 'bg-black');
  content = content.replace(/bg-slate-900/g, 'bg-[#0a0a0a]');
  content = content.replace(/bg-slate-800/g, 'bg-[#111]');
  content = content.replace(/bg-slate-700/g, 'bg-[#1a1a1a]');
  content = content.replace(/bg-\[\#1F2328\]/g, 'bg-[#1a1a1a]');
  
  // Specific light section "Start Your Journey" and "Reviews"
  content = content.replace(/bg-\[\#EEF0FF\]/g, 'bg-[#0a0a0a]');
  content = content.replace(/bg-blue-50\/50/g, 'bg-[#0a0a0a]');
  content = content.replace(/bg-blue-50/g, 'bg-white/5');
  content = content.replace(/bg-blue-100/g, 'bg-white/10');

  // Blue accents to white accents
  content = content.replace(/bg-blue-600/g, 'bg-white text-black');
  content = content.replace(/hover:bg-blue-700/g, 'hover:bg-gray-200 hover:text-black');
  content = content.replace(/text-blue-600/g, 'text-white');
  content = content.replace(/hover:text-blue-400/g, 'hover:text-gray-300');
  
  // More specific blue branding colors
  content = content.replace(/bg-\[\#2D3191\]/g, 'bg-white text-black');
  content = content.replace(/hover:bg-\[\#242875\]/g, 'hover:bg-gray-200');
  content = content.replace(/text-\[\#2D3191\]/g, 'text-white');
  content = content.replace(/ring-\[\#2D3191\]/g, 'ring-white/50');
  
  // Other remaining blues
  content = content.replace(/hover:bg-blue-600/g, 'hover:bg-white hover:text-black');

  // Re-write border colors to neutral
  content = content.replace(/border-slate-800/g, 'border-white/10');
  content = content.replace(/border-\[\#E6E8EF\]/g, 'border-white/10');

  // One specific issue: we might have nested "text-black text-white" if we blindly replaced bg-blue-600 with bg-white text-black, but it's fine for simple HTML classes. Let's fix duplicate text-white if it's there
  content = content.replace(/text-white text-black/g, 'text-black');
  content = content.replace(/text-black text-white/g, 'text-black');

  fs.writeFileSync(targetFile, content);
  console.log(`Sanitized ${filePath}`);
}

sanitizeTheme('app/routes/home.tsx');
sanitizeTheme('app/components/EarthScene.tsx');
