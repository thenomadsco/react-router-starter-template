const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, 'app/routes/home.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// The main container class should be bg-[#020617] text-white
content = content.replace('className="min-h-screen bg-transparent text-gray-900 font-sans overflow-x-hidden"', 'className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden"');

// Backgrounds
content = content.replace(/bg-white/g, 'bg-slate-900');
content = content.replace(/bg-gray-50/g, 'bg-[#020617]');
content = content.replace(/bg-gray-100/g, 'bg-slate-800');
content = content.replace(/bg-gray-200/g, 'bg-slate-700');
content = content.replace(/bg-\[\#FAFAF8\]/g, 'bg-slate-900');

// Text colors
content = content.replace(/text-gray-900/g, 'text-white');
content = content.replace(/text-gray-800/g, 'text-gray-200');
content = content.replace(/text-gray-700/g, 'text-gray-300');
content = content.replace(/text-gray-600/g, 'text-gray-400');
content = content.replace(/text-\[\#1F2328\]/g, 'text-white');

// Borders
content = content.replace(/border-gray-100/g, 'border-slate-800');
content = content.replace(/border-\[\#E6E8EF\]/g, 'border-slate-800');

// Mobile Menu (which had bg-white)
content = content.replace(/bg-slate-900 flex flex-col pt-24 px-6/g, 'bg-[#020617] flex flex-col pt-24 px-6'); 
content = content.replace(/<div className="fixed inset-0 z-\[100\] bg-slate-900 flex flex-col pt-24 px-6">/g, '<div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col pt-24 px-6">');

fs.writeFileSync(targetFile, content);
console.log('Theme updated successfully.');
