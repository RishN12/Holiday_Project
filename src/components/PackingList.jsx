import React, { useState, useEffect } from 'react';
import { DEFAULT_PACKING_ITEMS } from '../data/defaultPackingItems';
import { getStorageItem, setStorageItem, KEYS } from '../utils/storage';
import { CheckSquare, Plus, Trash2, RotateCcw, Filter, CheckCircle2, Circle } from 'lucide-react';

export default function PackingList() {
  const [items, setItems] = useState(() => getStorageItem(KEYS.PACKING, DEFAULT_PACKING_ITEMS));
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('Documents & Essentials');

  useEffect(() => {
    setStorageItem(KEYS.PACKING, items);
  }, [items]);

  const categories = ['All', ...new Set(items.map((i) => i.category))];

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem = {
      id: `custom_${Date.now()}`,
      category: newItemCat,
      name: newItemName.trim(),
      checked: false,
      essential: false
    };

    setItems((prev) => [newItem, ...prev]);
    setNewItemName('');
    setIsAdding(false);
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    if (window.confirm("Reset packing list to default Florida checklist?")) {
      setItems(DEFAULT_PACKING_ITEMS);
    }
  };

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter((item) => item.category === activeCategory);

  const totalCount = items.length;
  const checkedCount = items.filter((i) => i.checked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto animate-fadeIn">
      {/* Header & Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-sky-400" />
            Packing Checklist
          </h2>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Check off items as you pack. Progress automatically saves offline.
        </p>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Packing Progress
          </span>
          <span className="text-xs font-black text-sky-400">
            {checkedCount} / {totalCount} items ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Pills Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeCategory === cat
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Custom Item Modal Form */}
      {isAdding && (
        <form onSubmit={handleAddItem} className="bg-slate-900 border border-sky-500/40 rounded-2xl p-4 mb-4 space-y-3 animate-fadeIn">
          <h4 className="text-xs font-bold text-sky-300">Add New Packing Item</h4>
          <input
            type="text"
            placeholder="Item name (e.g. GoPro camera)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
          />
          <div className="flex gap-2">
            <select
              value={newItemCat}
              onChange={(e) => setNewItemCat(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            >
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
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
              Add Item
            </button>
          </div>
        </form>
      )}

      {/* Items List */}
      <div className="space-y-2 mb-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer active:scale-[0.99] ${
              item.checked
                ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                : 'bg-slate-900 border-slate-800/90 text-slate-100 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3 pr-2">
              <div className="shrink-0 text-sky-400">
                {item.checked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div>
                <span className="text-xs font-extrabold block leading-snug">{item.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">{item.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {item.essential && !item.checked && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                  MUST-HAVE
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id);
                }}
                className="text-slate-600 hover:text-rose-400 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleReset}
          className="text-[11px] text-slate-500 hover:text-slate-400 flex items-center justify-center gap-1 mx-auto"
        >
          <RotateCcw className="w-3 h-3" /> Reset checklist to defaults
        </button>
      </div>
    </div>
  );
}
