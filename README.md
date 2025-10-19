# 🎮 MANGALA - Türk Zeka ve Strateji Oyunu

Modern web teknolojileri ile geliştirilmiş, **23 maddelik resmi kuralları eksiksiz uygulayan** profesyonel Mangala oyunu.

![Mangala](https://img.shields.io/badge/Game-Mangala-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Özellikler

### 🎯 Oyun Motorau
- ✅ **23 maddelik resmi kuralların tam uygulaması**
- ✅ Deterministik ve test edilebilir saf fonksiyonlar
- ✅ Eksiksiz hamle validasyonu
- ✅ Otomatik set ve oyun bitişi tespiti

### 🎮 Oyun Modları
- 👥 **İki Oyuncu (PvP)**: Aynı cihazda iki kişi oynayabilir
- 🤖 **Bilgisayara Karşı (PvE)**: Üç zorluk seviyesi
  - **Kolay**: Rastgele + basit heuristik
  - **Orta**: Minimax algoritması (derinlik 4)
  - **Zor**: Alpha-Beta Pruning + gelişmiş heuristik (derinlik 6)

### 🎨 Görsel ve Tema
- 🌙 **Gece/Gündüz Modu**
- 🪵 **3 Tahta Stili**: Ahşap, Metal, Plastik
- 🔴 **3 Taş Rengi**: Kırmızı, Beyaz, Mavi
- ✨ Animasyonlu taş hareketleri
- 💫 Görsel efektler ve parıltılar

### 🌍 Çoklu Dil Desteği (i18n)
- 🇹🇷 **Türkçe** (varsayılan)
- 🇬🇧 **İngilizce**
- 🇰🇿 **Kazakça**

### 🔊 Ses Sistemi
- Taş hareket sesleri
- Özel melodi ve efektler
- Ayarlanabilir ses seviyesi
- Müzik açma/kapama

### 📊 Skor ve İstatistik
- 5 setlik turnuva sistemi
- Anlık skor takibi
- Set bazında detaylı istatistikler
- Oyun sonu özet ekranı

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adım 1: Bağımlılıkları Yükle
```bash
npm install
```

### Adım 2: Geliştirme Modunda Çalıştır
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

### Adım 3: Üretim İçin Derle
```bash
npm run build
```

### Adım 4: Testleri Çalıştır
```bash
npm test
```

## 📁 Proje Yapısı

```
mangala/
├── src/
│   ├── engine/              # Oyun motoru (pure functions)
│   │   ├── engine.ts        # 23 kurallı oyun mantığı
│   │   └── bot.ts           # AI algoritmaları
│   ├── types/               # TypeScript tip tanımları
│   │   └── game.types.ts
│   ├── client/              # Frontend (React)
│   │   ├── components/      # UI bileşenleri
│   │   │   ├── Board.tsx    # Oyun tahtası
│   │   │   ├── Pit.tsx      # Kuyu bileşeni
│   │   │   ├── Treasure.tsx # Hazne bileşeni
│   │   │   ├── Menu.tsx     # Ana menü
│   │   │   ├── GameOverModal.tsx
│   │   │   └── MessageToast.tsx
│   │   ├── store/           # State management (Zustand)
│   │   │   └── gameStore.ts
│   │   ├── i18n/            # Çoklu dil
│   │   │   ├── config.ts
│   │   │   └── locales/
│   │   │       ├── tr.json
│   │   │       ├── en.json
│   │   │       └── kk.json
│   │   ├── styles/          # CSS
│   │   │   └── index.css
│   │   ├── App.tsx          # Ana uygulama
│   │   └── main.tsx         # Entry point
│   └── server/              # Backend (gelecek özellik)
├── tests/                   # Unit testler
│   └── engine.test.ts
├── public/                  # Statik dosyalar
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎲 Oyun Kuralları (23 Madde)

### Temel Kurallar
1. Mangala iki kişi ile oynanır
2. 12 küçük kuyu + 2 büyük hazne
3. Sağdaki hazne kendi haznenizdir
4. 48 taş ile oynanır (her oyuncuya 24)
5-6. Her kuyuda başlangıçta 4'er taş

### Oyun Akışı
7. Önünüzdeki 6 kuyu sizin bölgenizdir
8. Haznede en fazla taş toplayan kazanır
9. Oyun sonunda en çok taş toplayan seti kazanır
10. Kura ile başlanır

### Hamle Yapma
11. İstediğiniz kuyudan taşları alın
12. Saat tersi yönde (sağa doğru) her kuyuya birer taş bırakın
13. **Son taş hazneye denk gelirse → Ekstra tur kazanırsınız**
14. Tek taş varsa aldığı kuyuya bırakma kuralı geçersizdir
15. Son taş hazne değilse → Sıra rakibe geçer

### Taş Yakalama
16-17. Rakip bölgesine de taş dağıtabilirsiniz
18. **Rakip bölgesinde çift yaparsanız (2,4,6,8...) → O kuyudaki tüm taşları yakalarsınız**
19. **Kendi boş kuyuya son taş + karşı taraf dolu → İkisini de yakalarsınız**

### Oyun Sonu
20. Bir tarafın kuyuları boşaldığında set biter
21. Tahtadaki kalan taşlar kazanana gider
22. **5 set oynanır**
23. **Kazanan 1 puan, berabere 0.5 puan alır**

## 🧠 Oyun Motoru Mimarisi

### Saf Fonksiyonlar (Pure Functions)
Oyun motoru tamamen yan etkisiz (side-effect free) fonksiyonlarla yazılmıştır:

```typescript
// State in → State out
function applyMove(gameState: GameState, pitIndex: number): MoveResult {
  // Immutable state transformation
  // No IO, no random, no side effects
  // Completely deterministic and testable
}
```

### Kural Motoru
Her hamle şu kontroller den geçer:

1. **Validasyon**: Hamle geçerli mi?
2. **Dağıtım**: Taşlar saat tersi yönde dağıtılır
3. **Ekstra Tur**: Son taş hazneye mi düştü?
4. **Çift Yakalama**: Rakip bölgesinde çift mi yapıldı?
5. **Karşı Yakalama**: Kendi boş + karşı dolu mu?
6. **Set Kontrolü**: Bir taraf boşaldı mı?

## 🤖 Bot AI Algoritmaları

### Kolay Bot
- %70 rastgele hamle
- %30 basit öncelik (hazneye ulaşma)

### Orta Bot
- **Minimax** algoritması
- Derinlik: 4
- Basit board değerlendirmesi

### Zor Bot
- **Alpha-Beta Pruning**
- Derinlik: 6
- Gelişmiş heuristik:
  - Hazne farkı (ağırlık: 10x)
  - Tahtadaki taş dağılımı (ağırlık: 2x)
  - Stratejik pozisyonlar

## 🧪 Testler

Kapsamlı unit testler ile tüm kurallar test edilmiştir:

```bash
npm test
```

Test kapsam alanları:
- ✅ Oyun başlatma
- ✅ Hamle validasyonu
- ✅ Taş dağıtımı
- ✅ Ekstra tur
- ✅ Çift yakalama
- ✅ Karşıdan yakalama
- ✅ Set bitişi
- ✅ Skor hesaplama

## 🛠️ Teknoloji Yığını

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Zustand** - State management
- **TailwindCSS** - Styling
- **i18next** - Internationalization

### Oyun Motoru
- **Pure TypeScript** - Saf fonksiyonlar
- **Immutable State** - Değişmez veri yapıları
- **Algorithm**: Minimax, Alpha-Beta Pruning

### Test & Quality
- **Jest** - Unit testing
- **TypeScript** - Type checking
- **ESLint** - Code linting

## 📝 Gelecek Özellikler

- [ ] Çevrimiçi multiplayer (Socket.IO)
- [ ] PostgreSQL veritabanı entegrasyonu
- [ ] Kullanıcı hesapları ve profiller
- [ ] Liderlik tablosu (leaderboard)
- [ ] Maç geçmişi ve replay
- [ ] Turnuva modu
- [ ] Mobil uygulama (React Native)

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📄 Lisans

MIT License - Detaylar için `LICENSE` dosyasına bakın.

## 👥 Yazarlar

- Geliştirici: [İsminiz]
- Tasarım: Mangala Geleneksel Oyun Kuralları

## 🙏 Teşekkürler

- Türk kültürünün bu eşsiz stratej oyunu için tüm ustalarımıza
- Açık kaynak topluluğuna

---

**Mangala - Asırlık Strateji, Modern Teknoloji** 🎮✨
