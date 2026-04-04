# 🪵 aiko.logger

![npm version](https://img.shields.io/npm/v/aiko.logger?color=36C5F0&style=for-the-badge)
![npm downloads](https://img.shields.io/npm/dt/aiko.logger?color=8A2BE2&style=for-the-badge)
![license](https://img.shields.io/npm/l/aiko.logger?color=44CC11&style=for-the-badge)
![node](https://img.shields.io/node/v/aiko.logger?color=339933&style=for-the-badge)

---

# 🇹🇷 Türkçe

**Aiko Development** ekosistemi için tasarlanmış, hafif, esnek ve sıfır bağımlılıklı (**zero-dependency**) gelişmiş loglama modülü.

Vue, Express web siteleri ve Discord botlarıyla kusursuz çalışması için optimize edilmiştir. Tam **TR/EN dil desteğine** sahiptir. Yeni asenkron motoru ile sisteminizi asla yavaşlatmaz!

## ✨ Öne Çıkan Özellikler

- 🌐 **Otomatik Dil Algılama:** İşletim sisteminizin diline (TR/EN) otomatik adapte olur.
- 🎨 **7 Log Seviyesi:** `info`, `success`, `warn`, `error`, `debug`, `fatal` ve özel lacivert `logerr` seviyesi.
- ⚡ **Asenkron Dosya İşlemleri:** `fs.promises` kullanır. Log yazarken ana projenizi bloklamaz (Non-blocking).
- 🧹 **Otomatik Temizlik (Auto-Cleanup):** Belirlediğiniz günden eski log dosyalarını otomatik bularak siler, disk dostudur.
- 📁 **Günlük Arşivleme (Rotation):** Logları tiplerine göre gün gün ayırarak saklar.
- 🚀 **Discord Webhook Entegrasyonu:** Kritik hataları Discord sunucunuza şık bir Embed olarak anında iletir.
- 🛡️ **Akıllı Formatlama:** Obje, Array ve Error (stack trace) çıktılarını otomatik olarak okunabilir hale getirir.
- 💎 **Sıfır Bağımlılık:** `chalk` veya `moment` içermez. Sadece yerleşik Node.js modülleri!

## 📦 Kurulum

```bash
npm install aiko.logger
```

## 🚀 Kullanım

```javascript
const { Logger } = require('aiko.logger');

// Logger'ı yapılandırın
const logger = new Logger({
  saveToFile: true,
  logFolder: './logs',
  keepLogsFor: 7,
  autoCleanup: true,
  webhookUrl: 'WEBHOOK_URL_BURAYA'
});

// Standart Kullanım
logger.info('Aiko sistemi başarıyla başlatıldı.');
logger.success('Veritabanına bağlanıldı.');
logger.debug('Önbellek temizlendi.');

// Uyarı ve Hatalar
logger.warn('Gecikme süresi yüksek!');
logger.error('Kullanıcı modülü yüklenemedi.');
logger.fatal('Sistem Çöküşü: Bellek sızıntısı!');
logger.logerr('Özel altyapı hatası!');
```

---

# 🇬🇧 English

A lightweight, flexible and **zero-dependency** advanced logger built for the **Aiko Development** ecosystem.

Optimized for Vue, Express, and Discord bots with full **TR/EN i18n support**. Powered by a new asynchronous engine to ensure it never slows down your system!

## ✨ Features

- 🌐 **Auto Language Detection:** Automatically adapts to your OS language (EN/TR).
- 🎨 **7 Log Levels:** `info`, `success`, `warn`, `error`, `debug`, `fatal`, and custom dark-blue `logerr`.
- ⚡ **Asynchronous File I/O:** Uses `fs.promises`. Non-blocking operations for maximum performance.
- 🧹 **Auto-Cleanup:** Automatically deletes old log files.
- 📁 **Daily Rotation:** Archives logs day by day.
- 🚀 **Discord Webhook Integration:** Sends critical errors to Discord.
- 🛡️ **Smart Formatting:** Parses Objects, Arrays, and Errors into readable output.
- 💎 **Zero Dependencies:** Pure built-in Node.js modules!

## 📦 Installation

```bash
npm install aiko.logger
```

## 🚀 Usage

```javascript
const { Logger } = require('aiko.logger');

const logger = new Logger({
  saveToFile: true,
  logFolder: './logs',
  keepLogsFor: 7,
  autoCleanup: true,
  webhookUrl: 'YOUR_WEBHOOK_URL'
});

logger.info('Aiko system started successfully.');
logger.success('Database connected.');
logger.debug('Cache cleared.');

logger.warn('High latency detected!');
logger.error('Failed to load user module.');
logger.fatal('System Crash: Memory leak!');
logger.logerr('Custom infrastructure error!');
```

---

## 📄 License

MIT License
