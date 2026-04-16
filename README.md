# 🪵 aiko.logger

> ⚡ High-performance, flexible, zero-dependency logger for modern
> Node.js applications

------------------------------------------------------------------------

![npm
version](https://img.shields.io/npm/v/aiko.logger?style=for-the-badge)
![downloads](https://img.shields.io/npm/dt/aiko.logger?style=for-the-badge)
![license](https://img.shields.io/npm/l/aiko.logger?style=for-the-badge)

------------------------------------------------------------------------

## 🚀 Overview

**aiko.logger** is a fast, extensible and production-ready logging
library designed for:

-   Discord bots 🤖\
-   APIs & backend services 🌐\
-   CLI tools 🖥️

Built with performance in mind using **non-blocking async I/O** and
**zero external dependencies**.

------------------------------------------------------------------------

## ✨ Features

-   ⚡ Non-blocking async architecture (`fs.promises`)
-   🎨 7 log levels (`info`, `success`, `warn`, `error`, `debug`,
    `fatal`, `logerr`)
-   📦 JSON logging support
-   ⚙️ Custom log level configuration
-   🔌 Custom transports system
-   📁 Daily log rotation
-   🧹 Auto cleanup system
-   🚀 Discord webhook integration
-   🛡️ Smart formatting (Object, Array, Error)
-   🌐 Auto language detection (TR/EN)
-   💎 Zero dependencies

------------------------------------------------------------------------

## 🖥️ Terminal Preview

``` bash
[INFO]    System started successfully
[SUCCESS] Database connected
[DEBUG]   Cache cleared
[WARN]    High latency detected
[ERROR]   Failed to load user module
[FATAL]   System crash detected
[LOGERR]  Custom infrastructure error
```

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

## ⚙️ Configuration

  Option        Description
  ------------- ----------------------------
  saveToFile    Enable file logging
  logFolder     Log directory
  keepLogsFor   Retention in days
  autoCleanup   Delete old logs
  webhookUrl    Discord webhook
  levels        Custom log levels
  transports    Custom transport functions

------------------------------------------------------------------------

## 📌 Use Cases

-   Discord bots\
-   Express / API servers\
-   Backend services\
-   CLI tools

------------------------------------------------------------------------

## ⭐ Support

If you like this project, consider giving it a star ⭐

------------------------------------------------------------------------

## 📄 License

MIT License
