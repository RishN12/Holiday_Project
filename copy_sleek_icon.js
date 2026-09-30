import fs from 'fs';
import path from 'path';

const sourceImg = 'C:\\Users\\rishn\\.gemini\\antigravity\\brain\\4dfb7ac7-753f-4596-bcb0-ef675dd5dcfb\\sleek_rocket_logo_1790780602083.jpg';
const publicDir = 'c:\\Users\\rishn\\Documents\\Coding\\Holiday_Project\\public';

fs.copyFileSync(sourceImg, path.join(publicDir, 'pwa-512x512.png'));
fs.copyFileSync(sourceImg, path.join(publicDir, 'pwa-192x192.png'));
fs.copyFileSync(sourceImg, path.join(publicDir, 'apple-touch-icon.png'));
fs.copyFileSync(sourceImg, path.join(publicDir, 'favicon.ico'));

console.log('Successfully updated PWA icons with new sleek rocket logo!');
