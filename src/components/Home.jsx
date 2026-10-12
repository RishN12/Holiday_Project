import React from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, ChevronRight, Gamepad2, MapPin, Plane, QrCode, Wallet } from 'lucide-react';

const shortcuts = [
  { id: 'itinerary', label: 'Trip plan', detail: 'Your schedule', icon: CalendarDays, tone: 'blue' },
  { id: 'packing', label: 'Packing', detail: 'Ready your bags', icon: CheckCircle2, tone: 'green' },
  { id: 'spending', label: 'Spending', detail: 'Track the budget', icon: Wallet, tone: 'gold' },
  { id: 'arcade', label: 'In-flight games', detail: 'Play offline', icon: Gamepad2, tone: 'purple' },
];

export default function Home({ setActiveTab, onOpenQR }) {
  return (
    <section className="home-page animate-fadeIn" aria-labelledby="home-title">
      <div className="home-welcome">
        <div>
          <p className="eyebrow">Your trip command center</p>
          <h2 id="home-title">Ready for Orlando?</h2>
          <p className="home-subtitle">Everything you need for a smoother week away.</p>
        </div>
        <div className="home-plane" aria-hidden="true"><Plane /></div>
      </div>

      <button className="trip-countdown" onClick={() => setActiveTab('itinerary')}>
        <div className="countdown-icon"><MapPin /></div>
        <div className="countdown-copy"><span>Next up</span><strong>Orlando, Florida</strong><small>Check your itinerary and travel details</small></div>
        <ChevronRight className="countdown-arrow" />
      </button>

      <div className="home-section-row"><h3>Quick access</h3><span>Offline ready</span></div>
      <div className="home-shortcuts">
        {shortcuts.map(({ id, label, detail, icon: Icon, tone }) => (
          <button key={id} className={`home-shortcut tone-${tone}`} onClick={() => setActiveTab(id)}>
            <span className="shortcut-icon"><Icon /></span><span className="shortcut-copy"><strong>{label}</strong><small>{detail}</small></span><ArrowRight className="shortcut-arrow" />
          </button>
        ))}
      </div>

      <div className="home-footer-card">
        <div className="home-footer-icon"><QrCode /></div>
        <div><strong>Travel card ready</strong><p>Keep your important QR code one tap away.</p></div>
        <button onClick={onOpenQR} aria-label="Open travel QR code"><ArrowRight /></button>
      </div>
    </section>
  );
}

