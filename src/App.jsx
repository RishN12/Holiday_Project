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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <Header onOpenQR={() => setIsQrOpen(true)} />

      {/* Main Content View */}
      <main className="flex-1 max-w-md w-full mx-auto">
        {activeTab === 'itinerary' && <Itinerary />}
        {activeTab === 'tip' && <TipCalculator />}
        {activeTab === 'currency' && <CurrencyConverter />}
        {activeTab === 'packing' && <PackingList />}
        {activeTab === 'spending' && <SpendingTracker />}
        {activeTab === 'arcade' && <ArcadeHub />}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* QR Code Phone Modal */}
      <QRCodeModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
    </div>
  );
}
