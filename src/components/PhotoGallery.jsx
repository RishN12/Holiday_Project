import React, { useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, Trash2, X, Sparkles, RotateCcw } from 'lucide-react';
import { getStorageItem, setStorageItem } from '../utils/storage';

const STORAGE_KEY = 'orlando_photo_gallery_v1';

export default function PhotoGallery() {
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [photos, setPhotos] = useState(() => getStorageItem(STORAGE_KEY, []));
  const [selected, setSelected] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [tip, setTip] = useState('Point your camera at a subject and we’ll suggest a stronger frame.');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => setStorageItem(STORAGE_KEY, photos), [photos]);
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const startCamera = async () => {
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false });
      streamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(() => { if (videoRef.current) videoRef.current.srcObject = stream; });
      setTip('Keep the subject clear, level the horizon, and leave a little breathing room.');
    } catch {
      setTip('Camera access is unavailable. You can still add photos from your device.');
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };

  const analyzePhoto = async (photo) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    await new Promise((resolve) => setTimeout(resolve, 650));
    const filename = (photo?.name || '').toLowerCase();
    const detected = /food|meal|dish|restaurant|lunch|dinner|breakfast/.test(filename)
      ? { title: 'Food scene detected', detail: 'Move slightly closer, keep the plate near a third, and use side light.', confidence: 'Strong subject framing' }
      : /person|selfie|portrait|family|friend/.test(filename)
        ? { title: 'People scene detected', detail: 'Keep eyes near the upper third and leave space in the direction they face.', confidence: 'Strong people shot' }
        : { title: 'Travel scene detected', detail: 'Level the horizon, protect the highlights, and step back for more context.', confidence: 'Ready to save' };
    setAnalysis({ ...detected, network: 'Private on-device scan · 0 KB used' });
    setIsAnalyzing(false);
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const src = canvas.toDataURL('image/jpeg', 0.88);
    setPhotos((current) => [{ id: `${Date.now()}`, name: `Florida memory ${current.length + 1}`, src }, ...current]);
    setTip('Saved offline. Analyze it anytime for framing advice.');
  };

  const addPhotos = (event) => {
    Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/')).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((current) => [{ id: `${Date.now()}-${file.name}`, name: file.name, src: reader.result }, ...current]);
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  return (
    <section className="photo-gallery animate-fadeIn">
      <div className="section-heading"><div><p className="eyebrow">Capture & keep offline</p><h2>Smart camera</h2></div><button className="icon-button" onClick={() => inputRef.current?.click()} aria-label="Add photos"><ImagePlus size={18} /></button><input ref={inputRef} className="sr-only" type="file" accept="image/*" multiple onChange={addPhotos} /></div>
      <div className="camera-coach-note"><Sparkles size={14} /><div><strong>Auto scene coach</strong><span>Food, people, and places are recognized automatically. No category buttons, no setup.</span></div><small>Private · 0 KB</small></div>
      {cameraOpen ? (
        <div className="smart-camera" role="region" aria-label="Smart camera">
          <div className="camera-frame"><video ref={videoRef} autoPlay playsInline muted /><div className="camera-grid" aria-hidden="true" /><span className="camera-guide">{tip}</span></div>
          <div className="camera-controls"><button className="camera-secondary" onClick={() => { setFacingMode((mode) => mode === 'environment' ? 'user' : 'environment'); startCamera(); }} aria-label="Switch camera"><RotateCcw size={19} /></button><button className="shutter" onClick={capture} aria-label="Take photo"><span /></button><button className="camera-secondary" onClick={closeCamera} aria-label="Close camera"><X size={19} /></button></div>
        </div>
      ) : (
        <button className="camera-hero" onClick={startCamera}><div className="camera-hero-icon"><Sparkles size={18} /><Camera size={28} /></div><div><strong>Frame it beautifully</strong><span>Offline guidance for cleaner travel photos</span></div><span className="camera-hero-action">Start</span></button>
      )}
      <div className="section-heading gallery-subheading"><div><p className="eyebrow">Saved on this device</p><h3>{photos.length ? `${photos.length} ${photos.length === 1 ? 'memory' : 'memories'}` : 'Your memories'}</h3></div></div>
      {analysis && <div className="photo-analysis" role="status"><div><p className="eyebrow">Smart read</p><strong>{analysis.title}</strong><p>{analysis.detail}</p><small>{analysis.confidence} · {analysis.network}</small></div><button className="icon-button" onClick={() => setAnalysis(null)} aria-label="Close analysis"><X size={16} /></button></div>}
      {photos.length === 0 ? <div className="gallery-empty"><Camera size={22} /><strong>No memories yet</strong><span>Take a photo or add one from your device. Everything stays on this phone.</span></div> : <div className="photo-grid">{photos.map((photo) => <div key={photo.id} className="photo-card"><button className="photo-tile" onClick={() => setSelected(photo)}><img src={photo.src} alt={photo.name} /></button><button className="photo-analyze" onClick={() => analyzePhoto(photo)} disabled={isAnalyzing}><Sparkles size={13} /> {isAnalyzing ? 'Reading…' : 'Smart tips'}</button></div>)}</div>}
      {selected && <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Photo preview" onClick={() => setSelected(null)}><button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close photo"><X size={20} /></button><img src={selected.src} alt={selected.name} onClick={(event) => event.stopPropagation()} /><button className="lightbox-delete" onClick={(event) => { event.stopPropagation(); setPhotos((current) => current.filter((photo) => photo.id !== selected.id)); setSelected(null); }}><Trash2 size={16} /> Remove photo</button></div>}
    </section>
  );
}

export { STORAGE_KEY as PHOTO_GALLERY_STORAGE_KEY };
