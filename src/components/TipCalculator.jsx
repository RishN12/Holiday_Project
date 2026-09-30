import React, { useState } from 'react';
import { getStorageItem, KEYS, DEFAULT_USD_GBP_RATE, formatUSD, formatGBP } from '../utils/storage';
import { Calculator, Users, DollarSign, HelpCircle, ArrowRight } from 'lucide-react';

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(18);
  const [splitCount, setSplitCount] = useState(1);
  const [customTip, setCustomTip] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const exchangeRate = getStorageItem(KEYS.RATE, DEFAULT_USD_GBP_RATE);

  const bill = parseFloat(billAmount) || 0;
  const activeTipPercent = isCustom ? (parseFloat(customTip) || 0) : tipPercent;
  
  const tipAmountUSD = bill * (activeTipPercent / 100);
  const totalUSD = bill + tipAmountUSD;
  const perPersonUSD = totalUSD / (splitCount || 1);

  const tipAmountGBP = tipAmountUSD * exchangeRate;
  const totalGBP = totalUSD * exchangeRate;
  const perPersonGBP = perPersonUSD * exchangeRate;

  const handleSelectPreset = (pct) => {
    setIsCustom(false);
    setTipPercent(pct);
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto animate-fadeIn">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-sky-400" />
          US Tipping Calculator
        </h2>
        <p className="text-xs text-slate-400">
          Calculate tip, total bill, and GBP equivalent instantly offline.
        </p>
      </div>

      {/* Calculator Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 mb-4">
        {/* Bill Amount Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Bill Amount (USD $)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-lg">
              $
            </div>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white font-extrabold text-2xl rounded-2xl pl-8 pr-4 py-3 focus:outline-none focus:border-sky-500 transition"
            />
          </div>
        </div>

        {/* Tip Percentage Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Select Tip Percentage
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[15, 18, 20].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleSelectPreset(pct)}
                className={`py-2.5 rounded-xl font-extrabold text-sm border transition ${
                  !isCustom && tipPercent === pct
                    ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/20'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {pct}%
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className={`py-2.5 rounded-xl font-extrabold text-xs border transition ${
                isCustom
                  ? 'bg-sky-500 text-slate-950 border-sky-400'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              Custom
            </button>
          </div>

          {isCustom && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                placeholder="Enter custom tip %"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
              <span className="text-xs text-slate-400 font-bold">%</span>
            </div>
          )}
        </div>

        {/* Split Bill */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              Split Bill
            </label>
            <span className="text-xs font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded-lg border border-sky-800">
              {splitCount} {splitCount === 1 ? 'Person' : 'People'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-bold w-10 h-10 rounded-xl flex items-center justify-center text-lg active:scale-95"
            >
              -
            </button>
            <input
              type="range"
              min="1"
              max="10"
              value={splitCount}
              onChange={(e) => setSplitCount(parseInt(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-bold w-10 h-10 rounded-xl flex items-center justify-center text-lg active:scale-95"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Results Card */}
      <div className="bg-gradient-to-br from-sky-950/60 via-slate-900 to-slate-900 border border-sky-500/30 rounded-3xl p-5 shadow-xl space-y-3 mb-5">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Tip Amount ({activeTipPercent}%):</span>
          <div className="text-right">
            <div className="text-base font-extrabold text-amber-400">{formatUSD(tipAmountUSD)}</div>
            <div className="text-[11px] text-slate-400 font-mono">({formatGBP(tipAmountGBP)})</div>
          </div>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Bill:</span>
          <div className="text-right">
            <div className="text-xl font-black text-white">{formatUSD(totalUSD)}</div>
            <div className="text-xs text-sky-400 font-mono">({formatGBP(totalGBP)})</div>
          </div>
        </div>

        {splitCount > 1 && (
          <div className="flex justify-between items-center pt-1 bg-sky-500/10 p-3 rounded-2xl border border-sky-500/20">
            <span className="text-xs text-sky-300 font-bold">Each Person Pays:</span>
            <div className="text-right">
              <div className="text-lg font-black text-sky-300">{formatUSD(perPersonUSD)}</div>
              <div className="text-xs text-sky-200 font-mono">({formatGBP(perPersonGBP)})</div>
            </div>
          </div>
        )}
      </div>

      {/* US Tipping Guide Info */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-sky-400" />
          US Tipping Guide
        </h4>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
          <li><strong>Sit-down Restaurants:</strong> 18% to 20% is expected for standard/good service.</li>
          <li><strong>Buffets & Fast Food:</strong> Tipping is optional or $1-$2 per table.</li>
          <li><strong>Taxi / Rideshare:</strong> 15% to 18% of fare.</li>
          <li><strong>Current exchange rate used:</strong> 1 USD = £{exchangeRate.toFixed(2)} GBP.</li>
        </ul>
      </div>
    </div>
  );
}
