# 🪵 aiko.logger

> ⚡ High-performance, zero-dependency logger for Node.js with JSON
> logging, custom levels, transports & TypeScript support

------------------------------------------------------------------------

![npm
version](https://img.shields.io/npm/v/aiko.logger?style=for-the-badge)
![downloads](https://img.shields.io/npm/dt/aiko.logger?style=for-the-badge)
![license](https://img.shields.io/npm/l/aiko.logger?style=for-the-badge)
![node](https://img.shields.io/node/v/aiko.logger?style=for-the-badge)

------------------------------------------------------------------------

## 🚀 Overview

**aiko.logger** is a fast, flexible and production-ready logging library
designed for:

-   Discord bots 🤖\
-   APIs & backend services 🌐\
-   CLI tools 🖥️

Built with **non-blocking async I/O** and **zero dependencies** for
maximum performance.

------------------------------------------------------------------------

## ✨ Features

-   ⚡ Non-blocking async architecture (`fs.promises`)
-   🎨 7 log levels (`info`, `success`, `warn`, `error`, `debug`,
    `fatal`, `logerr`)
-   📦 JSON logging support
-   🎛️ Custom log level configuration
-   🔌 Custom transports system
-   🧩 Prefix (scoped loggers)
-   🎚️ Log filtering with `minLevel`
-   📁 Daily log rotation
-   🧹 Auto cleanup system
-   🚀 Discord webhook integration
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
  logFolder: './logs',
  keepLogsFor: 7,
  autoCleanup: true,
  webhookUrl: 'YOUR_WEBHOOK_URL'
});

logger.info('System started');
logger.success('Database connected');
logger.warn('Latency detected');
logger.error('Something went wrong');
logger.fatal('System crash');
```

------------------------------------------------------------------------

## 🧩 Prefix & Scoped Loggers

``` js
const { Logger } = require('aiko.logger');

const dbLogger = new Logger({ prefix: 'MongoDB' });

dbLogger.info('Connection established.');
dbLogger.success('User schema loaded.');

const webLogger = new Logger({ 
  prefix: 'Express.js',
  minLevel: 'warn'
});

webLogger.info('This will NOT be logged');
webLogger.error('API request timed out!');
```

### Output

``` bash
[INFO]    [MongoDB] Connection established.
[SUCCESS] [MongoDB] User schema loaded.

[ERROR]   [Express.js] API request timed out!
```

------------------------------------------------------------------------

## 🧩 JSON Logging

``` js
logger.info({
  message: "User logged in",
  userId: 123,
  status: "success"
});
```

------------------------------------------------------------------------

## 🎛️ Custom Log Levels

``` js
const logger = new Logger({
  levels: {
    info: "blue",
    custom: "magenta"
  }
});

logger.custom("This is a custom log level");
```

------------------------------------------------------------------------

## 🔌 Custom Transports

``` js
const logger = new Logger({
  transports: [
    (log) => {
      console.log("Custom transport:", log);
    }
  ]
});
```

------------------------------------------------------------------------

## ⚡ Performance

-   Non-blocking file writes\
-   Zero dependencies\
-   Optimized for high-frequency logging

------------------------------------------------------------------------

## 📘 TypeScript Support

``` ts
import { Logger } from 'aiko.logger';

const logger = new Logger({ prefix: 'App' });

logger.info('Application started');
logger.error('Something went wrong');
```

------------------------------------------------------------------------

## ⚙️ Configuration

  Option        Description
  ------------- ----------------------------
  > saveToFile    Enable file logging
  > logFolder     Log directory
  > keepLogsFor   Retention in days
  > autoCleanup   Delete old logs
  > webhookUrl    Discord webhook
  > prefix        Add label to logs
  > minLevel      Filter log levels
  > levels        Custom log levels
  > transports    Custom transport functions

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
-   Simple API → easy to use\
-   Powerful features → production ready

------------------------------------------------------------------------

## ⭐ Support

If you like this project, consider giving it a star ⭐

------------------------------------------------------------------------

## 📄 License

MIT License
