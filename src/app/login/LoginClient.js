"use client";
import { useState, useCallback } from 'react';
import styles from './login.module.css';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropImage';
import { Upload, X } from 'lucide-react';
import BrandMark from '@/components/layout/BrandMark';

export default function LoginClient({ dict }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Image Crop States
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    if (pass.length < minLength) return "Şifre en az 6 karakter olmalıdır.";
    if (!hasUpperCase) return "Şifre en az bir büyük harf içermelidir.";
    if (!hasSpecialChar) return "Şifre en az bir özel karakter (!@#$ vb.) içermelidir.";
    return null;
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setFinalImage(croppedImage);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const res = await signIn('credentials', { redirect: false, email, password });
      if (res?.error) {
        setError(res.error === 'CredentialsSignin' ? 'E-posta adresiniz veya şifreniz hatalı!' : res.error);
        setLoading(false);
      } else {
        router.push('/feed');
        router.refresh();
      }
    } else {
      if (password !== confirmPassword) {
        setError("Şifreler eşleşmiyor! Lütfen kontrol edin.");
        setLoading(false);
        return;
      }

      const passError = validatePassword(password);
      if (passError) {
        setError(passError);
        setLoading(false);
        return;
      }

      if (!name.trim() || !username.trim()) {
        setError("Lütfen isim ve kullanıcı adı alanlarını doldurun.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, username, image: finalImage }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          setLoading(false);
        } else {
          await signIn('credentials', { redirect: false, email, password });
          router.push('/feed');
          router.refresh();
        }
      } catch (err) {
        setError("Bir hata oluştu");
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
          <BrandMark size={38} />
        </div>
        <h1 className={styles.title}>{isLogin ? dict.login.title : dict.login.sign_up}</h1>
        <p className={styles.subtitle}>{dict.login.subtitle}</p>
        
        <div className={styles.oauthButtons}>
          <button 
            className={styles.oauthButton} 
            onClick={() => signIn('google', { callbackUrl: '/feed' })}
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{marginRight:'8px',verticalAlign:'middle'}}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile devam et
          </button>
          <button 
            className={styles.oauthButton} 
            onClick={() => signIn('github', { callbackUrl: '/feed' })}
            type="button"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:'8px'}}>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub ile devam et
          </button>
        </div>
        
        <div className={styles.divider}>
          <span>{dict.login.or}</span>
        </div>

        {error && <p style={{ color: '#ff4444', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          
          {!isLogin && !showCropper && (
            <div className={styles.avatarUpload}>
              <label htmlFor="avatar-upload" className={styles.avatarLabel}>
                {finalImage ? (
                  <img src={finalImage} alt="Avatar" className={styles.avatarPreview} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <Upload size={24} />
                    <span>Profil Seç</span>
                  </div>
                )}
              </label>
              <input id="avatar-upload" type="file" accept="image/*" onChange={onFileChange} hidden />
            </div>
          )}

          {!isLogin && (
            <>
              <input 
                type="text" 
                placeholder="Ad Soyad (Örn: Alex Vance)" 
                className={styles.input} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
              <input 
                type="text" 
                placeholder="Kullanıcı Adı (Örn: @alexvance)" 
                className={styles.input} 
                value={username}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/\s/g, '');
                  setUsername(val.startsWith('@') ? val : (val ? '@' + val : ''));
                }}
                required={!isLogin}
              />
            </>
          )}

          <input 
            type="email" 
            placeholder={dict.login.email} 
            className={styles.input} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder={dict.login.password} 
            className={styles.input} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {!isLogin && (
            <input 
              type="password" 
              placeholder="Şifrenizi tekrar girin" 
              className={styles.input} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!isLogin}
            />
          )}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Bekleyin..." : (isLogin ? dict.login.sign_in : dict.login.sign_up)}
          </button>
        </form>
        
        <p className={styles.footerText}>
          {isLogin ? dict.login.no_account : "Zaten hesabınız var mı?"}{' '}
          <button 
            type="button" 
            className={styles.link} 
            style={{background:'none', border:'none', cursor:'pointer', fontSize:'inherit', padding: 0}}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setConfirmPassword('');
              setName('');
              setUsername('');
              setFinalImage(null);
            }}
          >
            {isLogin ? dict.login.sign_up : dict.login.sign_in}
          </button>
        </p>
      </div>

      {showCropper && (
        <div className={styles.cropperOverlay}>
          <div className={styles.cropperContainer}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className={styles.cropperControls}>
            <label style={{color:'white', fontSize:'0.9rem'}}>Yakınlaştır</label>
            <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} />
            <button type="button" onClick={showCroppedImage} className={styles.submitButton}>Kırp ve Kaydet</button>
            <button type="button" onClick={() => setShowCropper(false)} className={styles.cancelBtn}>İptal</button>
          </div>
        </div>
      )}
    </div>
  );
}
