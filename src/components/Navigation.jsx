import React, { useState, useEffect } from 'react';
import { Calendar, Calculator, ArrowLeftRight, CheckSquare, Wallet, Gamepad2, QrCode, Wifi, WifiOff } from 'lucide-react';

export function Header({ onOpenQR }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2.5">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950 p-1 shadow-lg shadow-cyan-500/10">
          <img src="/logo-premium-v3.png" alt="Orlando 2026 premium travel logo" className="h-full w-full object-contain" />
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
            Orlando 2026
            <span className="text-[10px] font-medium bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded-full">
              KSC & Universal
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Wifi className="w-3 h-3" /> Online Mode
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <WifiOff className="w-3 h-3" /> Offline (PWA Active)
              </span>
            )}
          </p>
        </div>
      </div>

      <button
        onClick={onOpenQR}
        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 shadow-sm"
        title="Scan QR Code to test on Pixel 9a"
      >
        <QrCode className="w-4 h-4" />
        <span className="hidden sm:inline">Phone QR</span>
      </button>
    </header>
  );
}

export function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'tip', label: 'Tip Calc', icon: Calculator },
    { id: 'currency', label: 'Currency', icon: ArrowLeftRight },
    { id: 'packing', label: 'Packing', icon: CheckSquare },
    { id: 'spending', label: 'Spending', icon: Wallet },
    { id: 'arcade', label: 'In-Flight ✈️', icon: Gamepad2, highlight: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-1.5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(2,6,23,0.45)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-sky-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition ${
                  isActive
                    ? item.highlight
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-sky-500/15 text-sky-400'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${item.highlight && !isActive ? 'text-amber-400 animate-pulse' : ''}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-sky-400 absolute bottom-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
