# 🪵 aiko.logger

**Aiko Development** ekosistemi için tasarlanmış, hafif, esnek ve sıfır bağımlılıklı (**zero-dependency**) gelişmiş loglama modülü.  
Özellikle Vue, Express web siteleri ve Discord botlarıyla sorunsuz çalışacak şekilde optimize edilmiştir.

---

## ✨ Öne Çıkan Özellikler

- 🎨 **Renkli Terminal Çıktıları**  
  Hata, uyarı ve bilgi mesajlarını ANSI kodlarıyla kolayca ayırt edin.

- 📁 **Otomatik Dosya Kaydı (File Rotation)**  
  Logları tiplerine göre (ör. `HATA-16-03-2026.log`) günlük olarak arşivler. Disk dolmalarına karşı dayanıklıdır.

- 🚀 **Discord Webhook Entegrasyonu**  
  Kritik hataları ve uyarıları Discord sunucunuza şık bir embed mesajı olarak gönderir.

- 🛡️ **Akıllı Formatlama & Sınır Koruması**  
  Obje, Array ve Error (stack trace) çıktıları otomatik olarak okunabilir hale getirilir.  
  Discord'un 4096 karakter sınırı güvenli şekilde yönetilir.

- ⚡ **Sıfır Bağımlılık**  
  `chalk`, `moment` gibi harici paketler içermez. Tamamen Node.js'in dahili modülleriyle yazılmıştır.

---

## 📦 Kurulum

```bash
npm install aiko.logger
```

---

## 🚀 Temel Kullanım

```js
const { Logger } = require('aiko.logger');

// Logger yapılandırma
const logger = new Logger({
    saveToFile: true,
    logFolder: './logs',
    webhookUrl: 'DISCORD_WEBHOOK_URL_BURAYA'
});

// Log örnekleri
logger.info('Aiko sistemi başarıyla başlatıldı.');
logger.success('Veritabanı bağlantısı kuruldu.');
logger.warn('Gecikme süresi yüksek: 250ms');
logger.error('Kritik bir modül yüklenemedi!');
```

---

## 🧠 Gelişmiş Kullanım

### 1️⃣ Obje / Array Loglama

```js
const userData = { id: 12345, username: "Furki", roles: ["Admin", "Dev"] };
logger.info(userData);
```

➡️ `[object Object]` yerine veriyi detaylı ve okunabilir şekilde gösterir.

---

### 2️⃣ Hata (Error) Yakalama

```js
try {
    throw new Error("API sunucusuna ulaşılamıyor!");
} catch (err) {
    logger.error(err);
}
```

➡️ Stack trace dahil tüm detayları hem terminale, hem dosyaya hem de Discord webhook'una gönderir.

---

## 🤝 Topluluk & Destek

Bu modül **Aiko Development** projesinin bir parçasıdır.  
Sorularınız ve önerileriniz için topluluğa katılabilirsiniz.

---

## 📄 Lisans

Bu proje **MIT lisansı** ile açık kaynak olarak paylaşılmıştır.
