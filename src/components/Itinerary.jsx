import React, { useState, useEffect } from 'react';
import { INITIAL_ITINERARY } from '../data/initialItinerary';
import { getStorageItem, setStorageItem, KEYS } from '../utils/storage';
import { Plane, Rocket, Compass, Award, Sparkles, Zap, CheckCircle, MapPin, Clock, Plus, Trash2, Edit2, Info, Hotel, Lightbulb } from 'lucide-react';

const ICON_MAP = {
  Plane: Plane,
  Rocket: Rocket,
  Compass: Compass,
  Award: Award,
  Sparkles: Sparkles,
  Zap: Zap,
  CheckCircle: CheckCircle
};

export default function Itinerary() {
  const [itinerary, setItinerary] = useState(() => getStorageItem(KEYS.ITINERARY, INITIAL_ITINERARY));
  const [selectedDayId, setSelectedDayId] = useState(INITIAL_ITINERARY[0].id);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');

  useEffect(() => {
    setStorageItem(KEYS.ITINERARY, itinerary);
  }, [itinerary]);

  const activeDay = itinerary.find((d) => d.id === selectedDayId) || itinerary[0];

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const updated = itinerary.map((day) => {
      if (day.id === selectedDayId) {
        return {
          ...day,
          activities: [
            ...day.activities,
            {
              time: newTime || 'Flex',
              title: newTitle.trim(),
              detail: newDetail.trim() || 'Custom activity note.'
            }
          ]
        };
      }
      return day;
    });

    setItinerary(updated);
    setNewTime('');
    setNewTitle('');
    setNewDetail('');
    setIsAddingActivity(false);
  };

  const handleDeleteActivity = (actIndex) => {
    const updated = itinerary.map((day) => {
      if (day.id === selectedDayId) {
        return {
          ...day,
          activities: day.activities.filter((_, idx) => idx !== actIndex)
        };
      }
      return day;
    });
    setItinerary(updated);
  };

  const handleResetItinerary = () => {
    if (window.confirm("Reset itinerary back to original schedule?")) {
      setItinerary(INITIAL_ITINERARY);
    }
  };

  const CategoryBadge = ({ category }) => {
    switch (category) {
      case 'nasa':
        return <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">NASA KSC</span>;
      case 'park':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">Universal Parks</span>;
      case 'flight':
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">Flight Day</span>;
      case 'tech':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">i-Fly & STEM</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-semibold">Activity</span>;
    }
  };

  const MainIcon = ICON_MAP[activeDay.icon] || Compass;

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto animate-fadeIn">
      {/* Horizontal Day Tab Picker */}
      <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
        {itinerary.map((day) => {
          const isSelected = day.id === selectedDayId;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDayId(day.id)}
              className={`snap-start shrink-0 px-3.5 py-2 rounded-2xl transition-all border text-left flex flex-col justify-center min-w-[100px] ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-sky-400/50 shadow-lg shadow-sky-600/20 scale-[1.02]'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-sky-200' : 'text-slate-500'}`}>
                {day.date.split(' ')[0]}
              </span>
              <span className="text-xs font-black truncate">{day.date.substring(4)}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-3xl p-5 shadow-xl mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-xs text-sky-400 font-bold uppercase tracking-wider block mb-1">
              {activeDay.fullDate}
            </span>
            <h2 className="text-xl font-extrabold text-white leading-tight flex items-center gap-2">
              {activeDay.title}
            </h2>
          </div>
          <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-2xl text-sky-400 shrink-0">
            <MainIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 mt-2 mb-3">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{activeDay.location}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
          <Hotel className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Accom: <strong>{activeDay.hotel}</strong></span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
          <CategoryBadge category={activeDay.category} />
          <span className="text-[11px] text-slate-400 font-medium">
            {activeDay.activities.length} schedule item{activeDay.activities.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Daily Tips Banner */}
      {activeDay.tips && (
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-3.5 mb-4 flex items-start gap-3">
          <div className="bg-amber-500/20 p-1.5 rounded-xl text-amber-400 shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-300 mb-0.5">Day Prep Tip</h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">{activeDay.tips}</p>
          </div>
        </div>
      )}

      {/* Activities Timeline */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-sky-400" />
          Daily Schedule
        </h3>
        <button
          onClick={() => setIsAddingActivity(!isAddingActivity)}
          className="bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Item
        </button>
      </div>

      {/* Add Custom Activity Form */}
      {isAddingActivity && (
        <form onSubmit={handleAddActivity} className="bg-slate-900 border border-sky-500/40 rounded-2xl p-4 mb-4 space-y-3 animate-fadeIn">
          <h4 className="text-xs font-bold text-sky-300">Add Custom Activity to {activeDay.date}</h4>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Time (e.g. 14:00)"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="col-span-1 bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
            <input
              type="text"
              placeholder="Activity Title *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="col-span-2 bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>
          <textarea
            placeholder="Details or notes..."
            value={newDetail}
            onChange={(e) => setNewDetail(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingActivity(false)}
              className="text-xs text-slate-400 px-3 py-1.5 rounded-xl hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-xl shadow-md transition"
            >
              Save Activity
            </button>
          </div>
        </form>
      )}

      {/* Activity Timeline List */}
      <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {activeDay.activities.map((act, index) => (
          <div key={index} className="relative pl-9 group">
            {/* Timeline dot */}
            <div className="absolute left-2.5 top-3.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-slate-950 -translate-x-1/2 shadow-sm" />
            
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 hover:border-slate-700 transition">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-md inline-block mb-1">
                    {act.time}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug">{act.title}</h4>
                </div>
                <button
                  onClick={() => handleDeleteActivity(index)}
                  className="text-slate-600 hover:text-rose-400 p-1 opacity-60 hover:opacity-100 transition"
                  title="Delete activity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{act.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleResetItinerary}
          className="text-[11px] text-slate-500 hover:text-slate-400 underline transition"
        >
          Reset to default school schedule
        </button>
      </div>
    </div>
  );
}
