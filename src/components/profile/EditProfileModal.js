"use client";
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropImage';
import { Camera, X } from 'lucide-react';

export default function EditProfileModal({ user }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [finalImage, setFinalImage] = useState(user.image || null);
  const [showCropper, setShowCropper] = useState(false);

  const fileInputRef = useRef(null);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      alert("Kırpma başarılı! Resim boyutu: " + croppedImage.length);
      setFinalImage(croppedImage);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
      alert("Kırpma hatası: " + e.message);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    alert("Kaydediliyor... Resim var mı? " + (finalImage ? "Evet (" + finalImage.length + " harf)" : "Hayır"));
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, image: finalImage }),
      });
      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      } else {
        const errorData = await res.json();
        alert("Hata: " + (errorData.error || "Bilinmeyen bir hata"));
      }
    } catch (err) {
      console.error(err);
      alert("Hata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          background: 'transparent', border: '1px solid var(--border-dark)', 
          color: 'var(--text-dark)', padding: '0.5rem 1rem', borderRadius: '9999px',
          fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        Profili düzenle
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-dark)', width: '90%', maxWidth: '600px', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-dark)', gap: '2rem' }}>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.2rem', flex: 1 }}>Profili düzenle</h2>
          <button onClick={handleSubmit} disabled={loading} style={{ background: 'white', color: 'black', border: 'none', padding: '0.4rem 1rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

        {!showCropper ? (
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
            
            <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', background: 'var(--card-dark)', alignSelf: 'center', border: '2px dashed var(--border-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {finalImage ? (
                <img src={finalImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : null}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
                <Camera size={32} color="white" />
              </div>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={onFileChange} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>İsim</label>
              <input value={name} onChange={e => setName(e.target.value)} style={{ background: 'transparent', border: '1px solid var(--border-dark)', color: 'white', padding: '1rem', borderRadius: '4px', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Kişisel Bilgiler (Bio)</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ background: 'transparent', border: '1px solid var(--border-dark)', color: 'white', padding: '1rem', borderRadius: '4px', outline: 'none', resize: 'none', minHeight: '100px' }} />
            </div>

          </div>
        ) : (
          <div style={{ height: '50vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
             <div style={{ flex: 1, position: 'relative' }}>
               <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={(area, pixels) => setCroppedAreaPixels(pixels)}
                onZoomChange={setZoom}
               />
             </div>
             <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-dark)' }}>
               <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} />
               <button onClick={showCroppedImage} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>Kırp ve Onayla</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
