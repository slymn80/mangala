# 🚀 Mangala - Hızlı Başlangıç Kılavuzu

## 📋 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükle (Zaten Yapıldı ✅)
```bash
npm install
```

### 2. Geliştirme Modunda Çalıştır
```bash
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresini açın.

### 3. Üretim İçin Derle
```bash
npm run build
```

### 4. Testleri Çalıştır
```bash
npm test
```

## 🎮 Oyunu Oynama

### Ana Menü
1. **Oyun Modu Seçin**:
   - 👥 **İki Oyuncu**: Aynı cihazda iki kişi oynayabilir
   - 🤖 **Bilgisayara Karşı**: Bot ile oynayın

2. **Bot Zorluğu** (sadece PvE modunda):
   - **Kolay**: Yeni başlayanlar için
   - **Orta**: Deneyimli oyuncular için
   - **Zor**: Uzmanlar için (Alpha-Beta pruning)

3. **Oyuncu İsimleri**: İsimlerinizi girin

4. **Oyunu Başlat** butonuna tıklayın

### Oyun Kuralları Özeti

#### Temel Mekanik
- 🎲 Kendi bölgenizdeki (alt sıra) dolu bir kuyu seçin
- 🔄 Taşlar saat tersi yönde (sağa doğru) dağıtılır
- 🏆 En fazla taşı haznenizde toplayın

#### Özel Durumlar
1. **Ekstra Tur** ⭐: Son taş kendi haznenize düşerse, tekrar oynarsınız
2. **Çift Yakalama** 🎯: Rakip bölgesinde çift (2,4,6,8...) yaparsanız, o kuyudaki tüm taşları alırsınız
3. **Karşı Yakalama** 💎: Kendi boş kuyunuza son taş düşerse VE karşısındaki kuyu doluysa, her ikisini de alırsınız

#### Set ve Skor
- 🏁 Bir tarafın tüm kuyuları boşaldığında set biter
- 📊 5 set oynanır
- 🥇 Kazanan 1 puan, berabere 0.5 puan alır

## ⚙️ Ayarlar

### Tema ve Görünüm
- 🌙 **Gece/Gündüz Modu**: Header'daki güneş/ay ikonuna tıklayın
- 🪵 **Tahta Stili**: Ahşap, Metal, Plastik (gelecek özellik)
- 🔴 **Taş Rengi**: Kırmızı, Beyaz, Mavi (gelecek özellik)

### Dil Seçenekleri
- 🇹🇷 Türkçe (varsayılan)
- 🇬🇧 İngilizce
- 🇰🇿 Kazakça

Dil değiştirmek için menüdeki bayrak ikonunu tıklayın.

## 🎯 İpuçları ve Stratejiler

### Yeni Başlayanlar İçin
1. **Hazneye Ulaşmaya Çalışın**: 4-5 numaralı kuyulardan oynamak daha kolay ekstra tur kazandırır
2. **Rakibi İzleyin**: Rakibinizin hangi kuyularında çok taş olduğuna dikkat edin
3. **Savunmalı Oynayın**: Karşınızdaki kuyuları boş tutmaya çalışın (Kural 19'a karşı)

### İleri Seviye Stratejiler
1. **Zincirleme Ekstra Turlar**: Birden fazla hamle ile sürekli ekstra tur kazanın
2. **Çift Tuzakları**: Rakibin bölgesinde 1, 3, 5, 7 taş olan kuyular bulun ve çift yapın
3. **Kuyu Kontrolü**: Karşınızdaki dolu kuyuların karşısını boş tutun

## 🐛 Sorun Giderme

### Oyun Yüklenmiyor
```bash
# Cache'i temizle ve tekrar başlat
rm -rf node_modules
npm install
npm run dev
```

### TypeScript Hataları
```bash
# Tip kontrolü yap
npm run lint
```

### Testler Çalışmıyor
```bash
# Jest cache'i temizle
npm test -- --clearCache
npm test
```

## 📚 Detaylı Kurallar

23 maddelik tüm resmi kuralları öğrenmek için oyun içindeki "📖 Kurallar" butonuna tıklayın.

## 🔧 Geliştirici Notları

### Proje Yapısı
```
src/
├── engine/          → Oyun mantığı (23 kural)
├── types/           → TypeScript tipleri
├── client/
│   ├── components/  → React bileşenleri
│   ├── store/       → Zustand state management
│   ├── i18n/        → Dil dosyaları
│   └── styles/      → CSS ve Tailwind
```

### Önemli Fonksiyonlar
- `initializeGame()`: Yeni oyun başlat
- `applyMove()`: Hamle yap ve sonucu döndür
- `getBotMove()`: AI hamlesi hesapla
- `updateGameScore()`: Skor güncelle

### Testler
```bash
# Tüm testleri çalıştır
npm test

# Watch modunda
npm test:watch

# Belirli test dosyası
npm test -- engine.test.ts
```

## 🎨 Özelleştirme

### Renkleri Değiştirme
`src/client/styles/index.css` dosyasındaki CSS değişkenlerini düzenleyin:
```css
:root {
  --stone-red: #dc2626;
  --stone-white: #f3f4f6;
  --stone-blue: #3b82f6;
}
```

### Yeni Dil Ekleme
1. `src/client/i18n/locales/` klasörüne yeni JSON dosyası ekleyin
2. `src/client/i18n/config.ts` içine kaydedin
3. `Menu.tsx` içindeki dil seçeneklerine ekleyin

## 📞 Destek

Sorun yaşarsanız:
1. README.md dosyasını okuyun
2. GitHub Issues açın
3. Testleri çalıştırın: `npm test`

---

**Keyifli Oyunlar!** 🎮✨
