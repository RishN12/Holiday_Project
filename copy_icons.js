import fs from 'fs';
import path from 'path';

const sourceImg = 'C:\\Users\\rishn\\.gemini\\antigravity\\brain\\4dfb7ac7-753f-4596-bcb0-ef675dd5dcfb\\orlando_app_logo_1790780176190.jpg';
const publicDir = 'c:\\Users\\rishn\\Documents\\Coding\\Holiday_Project\\public';

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy source image to public icons
fs.copyFileSync(sourceImg, path.join(publicDir, 'pwa-512x512.png'));
fs.copyFileSync(sourceImg, path.join(publicDir, 'pwa-192x192.png'));
fs.copyFileSync(sourceImg, path.join(publicDir, 'apple-touch-icon.png'));
fs.copyFileSync(sourceImg, path.join(publicDir, 'favicon.ico'));

console.log('Successfully copied PWA app logo icons to public directory!');
