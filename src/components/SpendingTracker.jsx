import React, { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, KEYS, DEFAULT_USD_GBP_RATE, formatUSD, formatGBP } from '../utils/storage';
import { Wallet, Plus, Trash2, PieChart, ShoppingBag, Utensils, Ticket, Plane, Package } from 'lucide-react';

export default function SpendingTracker() {
  const [expenses, setExpenses] = useState(() => getStorageItem(KEYS.SPENDING, []));
  const exchangeRate = getStorageItem(KEYS.RATE, DEFAULT_USD_GBP_RATE);
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState('');
  const [amountUsd, setAmountUsd] = useState('');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    setStorageItem(KEYS.SPENDING, expenses);
  }, [expenses]);

  const CATEGORIES = [
    { name: 'Food', icon: Utensils, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { name: 'Souvenirs', icon: ShoppingBag, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { name: 'Tickets', icon: Ticket, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { name: 'Flight', icon: Plane, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { name: 'Misc', icon: Package, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
  ];

  const handleAddExpense = (e) => {
    e.preventDefault();
    const val = parseFloat(amountUsd);
    if (!title.trim() || isNaN(val) || val <= 0) return;

    const newExp = {
      id: `exp_${Date.now()}`,
      title: title.trim(),
      amountUsd: val,
      category,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
    };

    setExpenses((prev) => [newExp, ...prev]);
    setTitle('');
    setAmountUsd('');
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const totalUsd = expenses.reduce((sum, item) => sum + item.amountUsd, 0);
  const totalGbp = totalUsd * exchangeRate;

  // Category totals breakdown
  const categoryTotals = CATEGORIES.map((cat) => {
    const total = expenses
      .filter((e) => e.category === cat.name)
      .reduce((sum, item) => sum + item.amountUsd, 0);
    return { ...cat, total };
  });

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-sky-400" />
            Spending Tracker
          </h2>
          <p className="text-xs text-slate-400">
            Log USD expenses & see live GBP total running balance.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Log Expense
        </button>
      </div>

      {/* Total Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-5 shadow-xl mb-4 relative overflow-hidden">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Total Spent So Far
        </span>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-amber-400">{formatUSD(totalUsd)}</h3>
          <span className="text-sm font-bold text-sky-300 font-mono">
            ({formatGBP(totalGbp)})
          </span>
        </div>

        {/* Category breakdown row */}
        <div className="grid grid-cols-5 gap-1.5 mt-4 pt-3 border-t border-slate-800/80">
          {categoryTotals.map((cat) => (
            <div key={cat.name} className="text-center">
              <span className="text-[10px] text-slate-400 block font-medium truncate">{cat.name}</span>
              <span className="text-[11px] font-bold text-slate-200 font-mono">
                ${cat.total.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Log Expense Form */}
      {isAdding && (
        <form onSubmit={handleAddExpense} className="bg-slate-900 border border-sky-500/40 rounded-2xl p-4 mb-4 space-y-3 animate-fadeIn">
          <h4 className="text-xs font-bold text-sky-300">Log New Purchase</h4>
          <input
            type="text"
            placeholder="Item / Description (e.g. NASA souvenir shirt)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                placeholder="Amount (USD)"
                value={amountUsd}
                onChange={(e) => setAmountUsd(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl pl-7 pr-3 py-2 text-white focus:outline-none focus:border-sky-500 font-bold"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 px-3 py-1.5 rounded-xl hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-xl shadow-md"
            >
              Save Purchase
            </button>
          </div>
        </form>
      )}

      {/* Expense History List */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Purchase Log ({expenses.length})
        </h3>

        {expenses.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs">
            No purchases logged yet. Tap "Log Expense" when you buy snacks or merch!
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((exp) => {
              const catObj = CATEGORIES.find((c) => c.name === exp.category) || CATEGORIES[0];
              const Icon = catObj.icon;
              return (
                <div key={exp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${catObj.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{exp.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {exp.category} • {exp.date} ({exp.timestamp})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-black text-amber-400">{formatUSD(exp.amountUsd)}</div>
                      <div className="text-[10px] font-mono text-sky-400">
                        {formatGBP(exp.amountUsd * exchangeRate)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="text-slate-600 hover:text-rose-400 p-1 opacity-60 hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
