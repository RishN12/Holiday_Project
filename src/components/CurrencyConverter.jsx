import React, { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, KEYS, DEFAULT_USD_GBP_RATE, formatUSD, formatGBP } from '../utils/storage';
import { ArrowLeftRight, Settings, DollarSign, RefreshCw, Sparkles } from 'lucide-react';

export default function CurrencyConverter() {
  const [rate, setRate] = useState(() => getStorageItem(KEYS.RATE, DEFAULT_USD_GBP_RATE));
  const [usdVal, setUsdVal] = useState('20');
  const [gbpVal, setGbpVal] = useState('');
  const [isUsdFocused, setIsUsdFocused] = useState(true);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [customRateInput, setCustomRateInput] = useState(rate.toString());

  useEffect(() => {
    setStorageItem(KEYS.RATE, rate);
  }, [rate]);

  useEffect(() => {
    if (isUsdFocused) {
      const u = parseFloat(usdVal);
      if (!isNaN(u)) {
        setGbpVal((u * rate).toFixed(2));
      } else {
        setGbpVal('');
      }
    }
  }, [usdVal, rate, isUsdFocused]);

  const handleGbpChange = (val) => {
    setIsUsdFocused(false);
    setGbpVal(val);
    const g = parseFloat(val);
    if (!isNaN(g) && rate > 0) {
      setUsdVal((g / rate).toFixed(2));
    } else {
      setUsdVal('');
    }
  };

  const handleSaveRate = (e) => {
    e.preventDefault();
    const r = parseFloat(customRateInput);
    if (!isNaN(r) && r > 0) {
      setRate(r);
      setIsEditingRate(false);
    }
  };

  const COMMON_PRICES = [
    { label: 'Theme Park Water Bottle', usd: 4.50 },
    { label: 'Space Center Lunch Combo', usd: 16.00 },
    { label: 'Universal Souvenir T-Shirt', usd: 32.00 },
    { label: 'NASA ATX Mission Patch', usd: 12.00 },
    { label: 'Cocoa Beach Beach Towel', usd: 22.00 },
    { label: 'Universal Hogwarts Wand', usd: 63.00 }
  ];

  const MATRIX_AMOUNTS = [1, 5, 10, 20, 50, 100];

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-sky-400" />
            USD ↔ GBP Converter
          </h2>
          <p className="text-xs text-slate-400">
            Offline currency calculator for your Florida trip.
          </p>
        </div>
        <button
          onClick={() => setIsEditingRate(!isEditingRate)}
          className="bg-slate-900 border border-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 hover:text-sky-400 transition"
        >
          <Settings className="w-3.5 h-3.5" />
          Rate
        </button>
      </div>

      {/* Rate Editor Modal/Banner */}
      {isEditingRate && (
        <form onSubmit={handleSaveRate} className="bg-slate-900 border border-sky-500/40 rounded-2xl p-4 mb-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-sky-300">Set Custom Exchange Rate</h4>
            <span className="text-[10px] text-slate-400">Default: 0.77</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">$1.00 USD = £</span>
            <input
              type="number"
              step="0.001"
              value={customRateInput}
              onChange={(e) => setCustomRateInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white font-bold text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl shrink-0"
            >
              Save Rate
            </button>
          </div>
        </form>
      )}

      {/* Main Conversion Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 mb-4">
        {/* USD Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              🇺🇸 US Dollar (USD)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">$</span>
          </div>
          <input
            type="number"
            step="any"
            value={usdVal}
            onFocus={() => setIsUsdFocused(true)}
            onChange={(e) => {
              setIsUsdFocused(true);
              setUsdVal(e.target.value);
            }}
            placeholder="0"
            className="w-full bg-transparent text-2xl font-black text-white focus:outline-none"
          />
        </div>

        {/* Swap Indicator */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-sky-500 text-slate-950 p-2 rounded-full border-4 border-slate-900 shadow-md">
            <ArrowLeftRight className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* GBP Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
              🇬🇧 British Pound (GBP)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">£</span>
          </div>
          <input
            type="number"
            step="any"
            value={gbpVal}
            onFocus={() => setIsUsdFocused(false)}
            onChange={(e) => handleGbpChange(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent text-2xl font-black text-sky-300 focus:outline-none"
          />
        </div>

        <div className="text-center text-[11px] text-slate-400 pt-1">
          Active rate: <strong>$1.00 USD = £{rate.toFixed(2)} GBP</strong>
        </div>
      </div>

      {/* Quick Reference Matrix */}
      <div className="mb-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Quick Price Conversion Sheet
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {MATRIX_AMOUNTS.map((amt) => {
            const gbp = (amt * rate).toFixed(2);
            return (
              <button
                key={amt}
                onClick={() => {
                  setIsUsdFocused(true);
                  setUsdVal(amt.toString());
                }}
                className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 p-2.5 rounded-2xl text-left transition active:scale-95"
              >
                <div className="text-sm font-black text-amber-400">${amt}</div>
                <div className="text-[11px] font-bold text-sky-300 font-mono">£{gbp}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Typical Florida Trip Prices */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Typical Florida Trip Prices
        </h4>
        <div className="space-y-2">
          {COMMON_PRICES.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-800/60 last:border-0">
              <span className="text-slate-300 font-medium">{item.label}</span>
              <div className="text-right">
                <span className="font-extrabold text-white">${item.usd.toFixed(2)}</span>
                <span className="text-sky-400 font-mono ml-1.5">({formatGBP(item.usd * rate)})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
