# 🪵 aiko.logger

![npm version](https://img.shields.io/npm/v/aiko.logger) ![npm
downloads](https://img.shields.io/npm/dw/aiko.logger)
![license](https://img.shields.io/npm/l/aiko.logger)
![node](https://img.shields.io/node/v/aiko.logger)

------------------------------------------------------------------------

# 🇹🇷 Türkçe

**Aiko Development** ekosistemi için tasarlanmış, hafif, esnek ve sıfır
bağımlılıklı (**zero-dependency**) gelişmiş loglama modülü.

Vue, Express ve Discord botlarıyla uyumludur. Tam **TR/EN dil desteği**
vardır.

## ✨ Özellikler

-   🌐 Otomatik dil algılama\
-   🎨 6 log seviyesi (info, success, warn, error, debug, fatal)\
-   📁 Günlük log dosyaları (rotation)\
-   🚀 Discord webhook desteği\
-   🛡️ Akıllı formatlama (object, error, stack)\
-   ⚡ Sıfır bağımlılık

## 📦 Kurulum

``` bash
npm install aiko.logger
```

## 🚀 Kullanım

``` js
const { Logger } = require('aiko.logger');

const logger = new Logger({
  saveToFile: true,
  webhookUrl: 'WEBHOOK_URL'
});

logger.info('Sistem başlatıldı');
logger.error('Hata oluştu');
```

------------------------------------------------------------------------

# 🇬🇧 English

A lightweight, flexible and **zero-dependency** logger built for the
**Aiko Development** ecosystem.

Optimized for Vue, Express and Discord bots with full **TR/EN i18n
support**.

## ✨ Features

-   🌐 Auto language detection\
-   🎨 6 log levels (info, success, warn, error, debug, fatal)\
-   📁 Daily log files (rotation)\
-   🚀 Discord webhook integration\
-   🛡️ Smart formatting (object, error, stack trace)\
-   ⚡ Zero dependencies

## 📦 Installation

``` bash
npm install aiko.logger
```

## 🚀 Usage

``` js
const { Logger } = require('aiko.logger');

const logger = new Logger({
  saveToFile: true,
  webhookUrl: 'WEBHOOK_URL'
});

logger.info('System started');
logger.error('Something went wrong');
```

------------------------------------------------------------------------

## 📄 License

MIT License
