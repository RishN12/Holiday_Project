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
  const [tip, setTip] = useState('Tap start camera for offline photo guidance.');

  useEffect(() => setStorageItem(STORAGE_KEY, photos), [photos]);
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const startCamera = async () => {
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false });
      streamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(() => { if (videoRef.current) videoRef.current.srcObject = stream; });
      setTip('Find the horizon and keep your subject slightly off-center.');
    } catch {
      setTip('Camera access is unavailable. You can still add photos from your device.');
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
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
    setTip('Saved offline. Try a lower angle for the next shot.');
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
      {cameraOpen ? (
        <div className="smart-camera" role="region" aria-label="Smart camera">
          <div className="camera-frame"><video ref={videoRef} autoPlay playsInline muted /><div className="camera-grid" aria-hidden="true" /><span className="camera-guide">{tip}</span></div>
          <div className="camera-controls"><button className="camera-secondary" onClick={() => { setFacingMode((mode) => mode === 'environment' ? 'user' : 'environment'); startCamera(); }} aria-label="Switch camera"><RotateCcw size={19} /></button><button className="shutter" onClick={capture} aria-label="Take photo"><span /></button><button className="camera-secondary" onClick={closeCamera} aria-label="Close camera"><X size={19} /></button></div>
        </div>
      ) : (
        <button className="camera-hero" onClick={startCamera}><div className="camera-hero-icon"><Sparkles size={18} /><Camera size={28} /></div><div><strong>Frame it beautifully</strong><span>Offline guidance for cleaner travel photos</span></div><span className="camera-hero-action">Start</span></button>
      )}
      <div className="section-heading gallery-subheading"><div><p className="eyebrow">Saved on this device</p><h3>{photos.length ? `${photos.length} ${photos.length === 1 ? 'memory' : 'memories'}` : 'Your memories'}</h3></div></div>
      {photos.length === 0 ? <div className="gallery-empty"><Camera size={22} /><span>Photos you take here stay available offline.</span></div> : <div className="photo-grid">{photos.map((photo) => <button key={photo.id} className="photo-tile" onClick={() => setSelected(photo)}><img src={photo.src} alt={photo.name} /></button>)}</div>}
      {selected && <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Photo preview" onClick={() => setSelected(null)}><button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close photo"><X size={20} /></button><img src={selected.src} alt={selected.name} onClick={(event) => event.stopPropagation()} /><button className="lightbox-delete" onClick={(event) => { event.stopPropagation(); setPhotos((current) => current.filter((photo) => photo.id !== selected.id)); setSelected(null); }}><Trash2 size={16} /> Remove photo</button></div>}
    </section>
  );
}

export { STORAGE_KEY as PHOTO_GALLERY_STORAGE_KEY };
