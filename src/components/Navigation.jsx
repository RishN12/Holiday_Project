import React, { useState, useEffect } from 'react';
import { Calendar, Calculator, ArrowLeftRight, CheckSquare, Wallet, Gamepad2, QrCode, Wifi, WifiOff, Images } from 'lucide-react';

export function Header({ onOpenQR }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const up = () => setIsOnline(true);
    const dn = () => setIsOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', dn);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', dn); };
  }, []);

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-[var(--line)] bg-[var(--bg)]/95 px-4 py-3 backdrop-blur-xl">
      {/* Logo */}
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-lg">
        <img src="/logo-premium-v3.png" alt="App logo" className="h-full w-full object-contain" />
      </div>

      {/* Title + status */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[15px] font-extrabold tracking-tight text-white leading-tight">
          Orlando 2026
        </h1>
        <div className="flex items-center gap-1 mt-0.5">
          {isOnline ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
              <Wifi className="w-2.5 h-2.5" /> Online
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
              <WifiOff className="w-2.5 h-2.5" /> Offline · PWA Active
            </span>
          )}
        </div>
      </div>

      {/* QR button */}
      <button
        onClick={onOpenQR}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink2)] transition hover:border-sky-500/60 hover:text-sky-400 active:scale-90"
        aria-label="QR code"
      >
        <QrCode className="h-4 w-4" />
      </button>
    </header>
  );
}

export function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'itinerary', label: 'Trip',     icon: Calendar },
    { id: 'tip',       label: 'Tip',      icon: Calculator },
    { id: 'currency',  label: 'Money',    icon: ArrowLeftRight },
    { id: 'packing',   label: 'Pack',     icon: CheckSquare },
    { id: 'spending',  label: 'Spend',    icon: Wallet },
    { id: 'arcade',    label: 'Arcade',   icon: Gamepad2, highlight: true },
    { id: 'photos',    label: 'Photos',   icon: Images },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto flex items-stretch">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHighlight = item.highlight;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 transition-all duration-200 active:scale-95 ${
                isActive ? '' : 'opacity-50 hover:opacity-75'
              }`}
            >
              {/* Active indicator line at top */}
              {isActive && (
                <span className={`absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full ${isHighlight ? 'bg-amber-400' : 'bg-sky-400'}`} />
              )}

              <div className={`p-1.5 rounded-xl transition ${
                isActive
                  ? isHighlight
                    ? 'bg-amber-400/15 text-amber-400'
                    : 'bg-sky-400/15 text-sky-400'
                  : isHighlight
                    ? 'text-amber-400'
                    : 'text-[var(--ink2)]'
              }`}>
                <Icon className="w-[18px] h-[18px]" />
              </div>

              <span className={`text-[9px] font-semibold tracking-wide ${
                isActive
                  ? isHighlight ? 'text-amber-400' : 'text-sky-400'
                  : 'text-[var(--ink2)]'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
