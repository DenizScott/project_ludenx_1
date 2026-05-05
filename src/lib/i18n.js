import { headers } from 'next/headers';
import en from './dictionaries/en.json';
import tr from './dictionaries/tr.json';

export function getDictionary() {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Eğer kullanıcının tarayıcı dili özellikle İngilizce içeriyorsa ve Türkçe ile başlamıyorsa EN göster
  if (acceptLanguage.toLowerCase().includes('en') && !acceptLanguage.toLowerCase().startsWith('tr')) {
    return en;
  }
  
  // Varsayılan dil Türkçe
  return tr; 
}
