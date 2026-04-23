# 🪵 aiko.logger

> ⚡ High-performance, zero-dependency logger for Node.js with JSON
> logging, transports, prefix & webhook support

------------------------------------------------------------------------

![npm
version](https://img.shields.io/npm/v/aiko.logger?style=for-the-badge)
![downloads](https://img.shields.io/npm/dt/aiko.logger?style=for-the-badge)
![license](https://img.shields.io/npm/l/aiko.logger?style=for-the-badge)
![node](https://img.shields.io/node/v/aiko.logger?style=for-the-badge)


------------------------------------------------------------------------

## 🚀 Overview

**aiko.logger** is a fast, flexible and production-ready logging library
for Node.js.

-   Discord bots 🤖\
-   APIs & backend services 🌐\
-   CLI tools 🖥️

Built with **non-blocking async I/O** and **zero dependencies**.

------------------------------------------------------------------------

## ✨ Features

-   ⚡ Non-blocking async architecture
-   🎨 7 log levels
-   📦 JSON logging support
-   🔌 Custom transports system
-   🧩 Prefix (scoped loggers)
-   🎚️ Log filtering (`minLevel`)
-   📁 Daily log rotation
-   🧹 Auto cleanup system
-   🚀 Discord webhook integration (with embeds)
-   🛡️ Smart formatting (Object, Array, Error)
-   🌐 Auto language detection (TR/EN)
-   📘 TypeScript support
-   💎 Zero dependencies

------------------------------------------------------------------------

## 📦 Installation

``` bash
npm install aiko.logger
```

------------------------------------------------------------------------

## ⚡ Quick Start

``` js
const { Logger } = require('aiko.logger');

const logger = new Logger({
  saveToFile: true,
  webhookUrl: 'YOUR_WEBHOOK_URL',
  prefix: 'App'
});

logger.info('System started');
logger.error('Something went wrong');
```

------------------------------------------------------------------------

## 🧩 Prefix & Log Filtering

``` js
const dbLogger = new Logger({ prefix: 'MongoDB' });

dbLogger.info('Connection established.');

const webLogger = new Logger({ 
  prefix: 'Express',
  minLevel: 'warn'
});

webLogger.info('This will NOT log');
webLogger.error('Timeout!');
```

------------------------------------------------------------------------

## 📦 JSON Logging

``` js
const logger = new Logger({
  format: 'json',
  saveToFile: true
});
```

Output:

``` json
{
  "timestamp": "2026-01-01T12:00:00.000Z",
  "level": "INFO",
  "message": "System started",
  "prefix": "App"
}
```

------------------------------------------------------------------------

## 🔌 Custom Transports

``` js
logger.addTransport((log) => {
  console.log("Custom transport:", log);
});
```

------------------------------------------------------------------------

## 🚀 Webhook Integration

-   Sends logs as **Discord embeds**
-   Includes prefix, level and timestamp

------------------------------------------------------------------------

## 🧹 Auto Cleanup

``` js
const logger = new Logger({
  saveToFile: true,
  keepLogsFor: 7,
  autoCleanup: true
});
```

------------------------------------------------------------------------

## ⚙️ Configuration

  Option        Description
  ------------- ---------------------
  saveToFile    Enable file logging
  logFolder     Log directory
  keepLogsFor   Retention days
  autoCleanup   Delete old logs
  webhookUrl    Discord webhook
  prefix        Label logs
  minLevel      Filter logs
  format        `text` or `json`

------------------------------------------------------------------------

## ⚔️ Comparison

  Feature             aiko.logger   winston   pino
  ------------------- ------------- --------- ------
  Zero dependency     ✅            ❌        ❌
  JSON logging        ✅            ✅        ✅
  Custom transports   ✅            ✅        ⚠️
  Lightweight         ✅            ❌        ✅

------------------------------------------------------------------------

## 🚀 Why aiko.logger?

-   No dependencies → no bloat\
-   Clean API → easy to use\
-   Production-ready features

------------------------------------------------------------------------

## ⭐ Support

Give a ⭐ if you like it!

------------------------------------------------------------------------

## 📄 License

MIT License
