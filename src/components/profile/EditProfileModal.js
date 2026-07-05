"use client";
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropImage';
import { Camera, X, Image as ImageIcon } from 'lucide-react';

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
  const [finalBanner, setFinalBanner] = useState(user.bannerImage || null);
  
  const [showCropper, setShowCropper] = useState(false);
  const [cropType, setCropType] = useState('avatar'); // 'avatar' (1:1) or 'banner' (3.5:1)

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

  const startAvatarUpload = () => {
    setCropType('avatar');
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const startBannerUpload = () => {
    setCropType('banner');
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, cropType === 'banner');
      if (cropType === 'avatar') {
        setFinalImage(croppedImage);
      } else {
        setFinalBanner(croppedImage);
      }
      setShowCropper(false);
    } catch (e) {
      console.error(e);
      alert("Kırpma hatası: " + e.message);
    }
  }, [imageSrc, croppedAreaPixels, cropType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, image: finalImage, bannerImage: finalBanner }),
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
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--bg-dark)', width: '90%', maxWidth: '600px', borderRadius: '16px', border: '1px solid var(--border-dark)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-dark)', gap: '1rem' }}>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.2rem', flex: 1 }}>
            {showCropper ? (cropType === 'avatar' ? 'Profil Fotoğrafını Kırp' : 'Kapak Fotoğrafını Kırp') : 'Profili düzenle'}
          </h2>
          {!showCropper && (
            <button onClick={handleSubmit} disabled={loading} style={{ background: 'var(--accent)', color: '#081018', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          )}
        </div>

        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={onFileChange} />

        {!showCropper ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
            
            {/* Banner ve Avatar Yükleme Alanı */}
            <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--panel-raised), rgba(105, 228, 255, 0.15))', border: '2px dashed var(--border-dark)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {finalBanner && (
                <img src={finalBanner} alt="Banner Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', cursor: 'pointer', transition: 'background 0.2s' }} onClick={startBannerUpload}>
                <ImageIcon size={28} color="white" />
                <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '0.4rem' }}>Kapak Fotoğrafını (Banner) Değiştir</span>
              </div>
            </div>

            {/* Avatar Yükleme Alanı */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '-3rem', paddingLeft: '1rem', zIndex: 5 }}>
              <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: 'var(--card-dark)', border: '4px solid var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                {finalImage ? (
                  <img src={finalImage} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : null}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', cursor: 'pointer' }} onClick={startAvatarUpload}>
                  <Camera size={24} color="white" />
                </div>
              </div>
              <div style={{ paddingTop: '2.5rem' }}>
                <button type="button" onClick={startAvatarUpload} style={{ background: 'var(--panel-dark)', border: '1px solid var(--border-dark)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Profil Fotoğrafını Değiştir
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>İsim</label>
              <input value={name} onChange={e => setName(e.target.value)} style={{ background: 'var(--panel-dark)', border: '1px solid var(--border-dark)', color: 'white', padding: '0.8rem 1rem', borderRadius: '8px', outline: 'none', fontSize: '1rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Kişisel Bilgiler (Bio)</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ background: 'var(--panel-dark)', border: '1px solid var(--border-dark)', color: 'white', padding: '0.8rem 1rem', borderRadius: '8px', outline: 'none', resize: 'none', minHeight: '100px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
            </div>

          </div>
        ) : (
          <div style={{ height: '55vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
             <div style={{ flex: 1, position: 'relative', background: '#000' }}>
               <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={cropType === 'avatar' ? 1 : 3.5}
                onCropChange={setCrop}
                onCropComplete={(area, pixels) => setCroppedAreaPixels(pixels)}
                onZoomChange={setZoom}
               />
             </div>
             <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-dark)', borderTop: '1px solid var(--border-dark)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Yakınlaştır:</span>
                 <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} style={{ flex: 1 }} />
               </div>
               <div style={{ display: 'flex', gap: '1rem' }}>
                 <button type="button" onClick={() => setShowCropper(false)} style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-dark)', color: 'white', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>İptal</button>
                 <button type="button" onClick={showCroppedImage} style={{ flex: 2, background: 'var(--accent)', color: '#081018', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Kırp ve Onayla</button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
