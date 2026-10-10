import React, { useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, Trash2, X } from 'lucide-react';
import { getStorageItem, setStorageItem } from '../utils/storage';

const STORAGE_KEY = 'orlando_photo_gallery_v1';

export default function PhotoGallery() {
  const inputRef = useRef(null);
  const [photos, setPhotos] = useState(() => getStorageItem(STORAGE_KEY, []));
  const [selected, setSelected] = useState(null);

  useEffect(() => setStorageItem(STORAGE_KEY, photos), [photos]);

  const addPhotos = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((current) => [{ id: `${Date.now()}-${file.name}`, name: file.name, src: reader.result }, ...current]);
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  return (
    <section className="photo-gallery animate-fadeIn">
      <div className="section-heading">
        <div><p className="eyebrow">Trip memories</p><h2>Photo gallery</h2></div>
        <button className="icon-button" onClick={() => inputRef.current?.click()} aria-label="Add photos"><ImagePlus size={18} /></button>
        <input ref={inputRef} className="sr-only" type="file" accept="image/*" multiple onChange={addPhotos} />
      </div>
      {photos.length === 0 ? (
        <button className="gallery-empty" onClick={() => inputRef.current?.click()}>
          <Camera size={24} /><strong>Keep the trip close</strong><span>Add photos to keep them available offline.</span>
        </button>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => <button key={photo.id} className="photo-tile" onClick={() => setSelected(photo)}><img src={photo.src} alt={photo.name} /></button>)}
        </div>
      )}
      {selected && <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Photo preview" onClick={() => setSelected(null)}>
        <button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close photo"><X size={20} /></button>
        <img src={selected.src} alt={selected.name} onClick={(event) => event.stopPropagation()} />
        <button className="lightbox-delete" onClick={(event) => { event.stopPropagation(); setPhotos((current) => current.filter((photo) => photo.id !== selected.id)); setSelected(null); }}><Trash2 size={16} /> Remove photo</button>
      </div>}
    </section>
  );
}

export { STORAGE_KEY as PHOTO_GALLERY_STORAGE_KEY };
