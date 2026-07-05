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
            <span>{dict.login.continue_google}</span>
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
                placeholder="Ad Soyad (Örn: Deniz Scott)" 
                className={styles.input} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
              <input 
                type="text" 
                placeholder="Kullanıcı Adı (Örn: @denizscott)" 
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
