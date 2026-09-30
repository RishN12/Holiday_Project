import QRCode from 'qrcode';
import path from 'path';

const url = 'http://192.168.0.41:5173';
const outputPath = 'C:\\Users\\rishn\\.gemini\\antigravity\\brain\\4dfb7ac7-753f-4596-bcb0-ef675dd5dcfb\\qr_code.png';

QRCode.toFile(outputPath, url, {
  width: 400,
  margin: 2,
  color: {
    dark: '#0F172A',
    light: '#FFFFFF'
  }
}, (err) => {
  if (err) throw err;
  console.log('QR Code PNG generated successfully at:', outputPath);
});
