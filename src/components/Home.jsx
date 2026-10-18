import React, { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, ChevronRight, Download, Gamepad2, MapPin, Plane, Wallet } from 'lucide-react';

const shortcuts = [
  { id: 'itinerary', label: 'Trip plan', detail: 'Your schedule', icon: CalendarDays, tone: 'blue' },
  { id: 'packing', label: 'Packing', detail: 'Ready your bags', icon: CheckCircle2, tone: 'green' },
  { id: 'spending', label: 'Spending', detail: 'Track the budget', icon: Wallet, tone: 'gold' },
  { id: 'arcade', label: 'In-flight games', detail: 'Play offline', icon: Gamepad2, tone: 'purple' },
];

export default function Home({ setActiveTab }) {
  const [now, setNow] = useState(() => new Date());
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsInstalled(standalone);
    const handleInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  };

  useEffect(() => {
    let timer;
    const updateClock = () => setNow(new Date());
    const startClock = () => {
      window.clearInterval(timer);
      updateClock();
      timer = window.setInterval(updateClock, 1000);
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') startClock();
      else window.clearInterval(timer);
    };
    startClock();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const formatTime = (timeZone) => new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  const formatDate = (timeZone) => new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(now);

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

      <div className="home-time-grid" aria-label="Current local and UK time">
        <div className="home-time-card home-time-local">
          <span className="home-time-label">Florida time</span>
          <strong>{formatTime('America/New_York')}</strong>
          <small>{formatDate('America/New_York')} · Local</small>
        </div>
        <div className="home-time-card home-time-uk">
          <span className="home-time-label">UK time</span>
          <strong>{formatTime('Europe/London')}</strong>
          <small>{formatDate('Europe/London')} · London</small>
        </div>
      </div>

      <button className="trip-countdown" onClick={() => setActiveTab('itinerary')}>
        <div className="countdown-icon"><MapPin /></div>
        <div className="countdown-copy"><span>Next up</span><strong>Orlando, Florida</strong><small>Check your itinerary and travel details</small></div>
        <ChevronRight className="countdown-arrow" />
      </button>

      {!isInstalled && <div className="install-card"><span className="install-card-icon"><Download /></span><div><strong>Install for offline use</strong><p>{installPrompt ? 'Add Orlando Trip to your home screen.' : 'Use your browser menu and choose “Add to Home Screen”.'}</p></div>{installPrompt && <button onClick={installApp}>Install</button>}</div>}

      <div className="home-section-row"><h3>Quick access</h3><span>Offline ready</span></div>
      <div className="home-shortcuts">
        {shortcuts.map(({ id, label, detail, icon: Icon, tone }) => (
          <button key={id} className={`home-shortcut tone-${tone}`} onClick={() => setActiveTab(id)}>
            <span className="shortcut-icon"><Icon /></span><span className="shortcut-copy"><strong>{label}</strong><small>{detail}</small></span><ArrowRight className="shortcut-arrow" />
          </button>
        ))}
      </div>

    </section>
  );
}

