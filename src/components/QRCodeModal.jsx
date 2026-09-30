import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, Smartphone, Wifi, Check, Copy } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:5173';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-3 text-sky-400">
          <div className="bg-sky-500/10 p-3 rounded-2xl border border-sky-500/20">
            <QrCode className="w-8 h-8" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-1">Scan on Pixel 9a</h3>
        <p className="text-xs text-slate-400 mb-4">
          Scan this QR code with your phone camera to test the app on your phone immediately!
        </p>

        <div className="bg-white p-4 rounded-xl inline-block shadow-inner mb-4">
          <QRCodeSVG value={currentUrl} size={180} level="H" includeMargin={true} />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 break-all mb-4 flex items-center justify-between gap-2">
          <span className="truncate">{currentUrl}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg flex items-center gap-1 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="bg-sky-950/40 border border-sky-800/40 rounded-xl p-3 text-left flex items-start gap-2.5">
          <Wifi className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-sky-200 leading-snug">
            <strong>Offline Ready:</strong> Once opened on your phone, tap "Add to Home Screen" to install it as a PWA. It will work completely offline!
          </p>
        </div>
      </div>
    </div>
  );
}
