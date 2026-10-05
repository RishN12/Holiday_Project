import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, Wifi, Check, Copy } from 'lucide-react';

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
      <div className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#171918] p-5 text-center text-[#f3f0e9] shadow-2xl shadow-black/40">
        <div className="mb-5 flex items-center justify-between text-left">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c99a68]">Share trip</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">Open on another phone</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close QR code"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#a7aaa4] transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-auto mb-5 inline-block rounded-2xl bg-white p-4 shadow-inner">
          <QRCodeSVG value={currentUrl} size={184} level="H" includeMargin={true} />
        </div>
        <p className="mb-4 text-sm leading-relaxed text-[#a7aaa4]">Scan this code with a camera to open the trip companion.</p>

        <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2 text-left">
          <span className="min-w-0 flex-1 truncate px-2 text-[11px] text-[#a7aaa4]">{currentUrl}</span>
          <button
            onClick={handleCopy}
            aria-label="Copy trip link"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#f3f0e9] transition hover:bg-white/15"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-[#c99a68]/20 bg-[#c99a68]/10 p-3 text-left">
          <Wifi className="mt-0.5 h-4 w-4 shrink-0 text-[#c99a68]" />
          <p className="text-[11px] leading-relaxed text-[#ddd0bf]">The app is designed to keep your itinerary and travel tools available offline after installation.</p>
        </div>
      </div>
    </div>
  );
}
