import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = 'http://192.168.0.41:5174';
const out = path.join('C:/Users/rishn/.gemini/antigravity/brain/4dfb7ac7-753f-4596-bcb0-ef675dd5dcfb', 'qr_code.png');

await QRCode.toFile(out, url, { width: 300, margin: 2, color: { dark: '#000', light: '#fff' } });
console.log('QR Code generated:', out, '→', url);
