import React, { useState } from 'react';
import { Header, BottomNav } from './components/Navigation';
import Itinerary from './components/Itinerary';
import TipCalculator from './components/TipCalculator';
import CurrencyConverter from './components/CurrencyConverter';
import PackingList from './components/PackingList';
import SpendingTracker from './components/SpendingTracker';
import ArcadeHub from './components/InFlightArcade/ArcadeHub';
import QRCodeModal from './components/QRCodeModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isQrOpen, setIsQrOpen] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)] text-[var(--ink)] selection:bg-sky-400/30 selection:text-sky-200">
      <Header onOpenQR={() => setIsQrOpen(true)} />

      <main className="flex-1 w-full max-w-md mx-auto px-3 pb-28 pt-3 overflow-x-hidden">
        {activeTab === 'itinerary'  && <Itinerary />}
        {activeTab === 'tip'        && <TipCalculator />}
        {activeTab === 'currency'   && <CurrencyConverter />}
        {activeTab === 'packing'    && <PackingList />}
        {activeTab === 'spending'   && <SpendingTracker />}
        {activeTab === 'arcade'     && <ArcadeHub />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <QRCodeModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
    </div>
  );
}
