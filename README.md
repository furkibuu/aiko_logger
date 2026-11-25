# 🪵 aiko.logger

> Lightweight, zero-dependency logger for Node.js — colored console output, daily log files, JSON logging, scoped child loggers, custom transports and Discord webhooks.

![npm version](https://img.shields.io/npm/v/aiko.logger?style=for-the-badge)
![downloads](https://img.shields.io/npm/dt/aiko.logger?style=for-the-badge)
![license](https://img.shields.io/npm/l/aiko.logger?style=for-the-badge)
![node](https://img.shields.io/node/v/aiko.logger?style=for-the-badge)

🇹🇷 [Türkçe dokümantasyon](./README.tr.md)

---

## ✨ Features

- 🎨 **7 log levels** — `debug`, `info`, `success`, `warn`, `error`, `logerr`, `fatal`
- 🧩 **Child loggers** — `logger.child('DB')` → prefix `App:DB`, shares files/webhook/transports
- 📁 **Daily log files** — one file per level per day, text or JSON
- 🧹 **Auto cleanup** — deletes old log files (only files created by aiko.logger)
- 🚀 **Discord webhooks** — embeds, rate-limit (429) retry, queue, `webhookMinLevel`
- 🔌 **Custom transports** — send logs anywhere (DB, HTTP, Slack…); a failing transport never crashes your app
- 🎚️ **Level filtering** — `minLevel`
- 🛡️ **Smart formatting** — objects, arrays, `Error` stacks, multiple arguments
- 🌐 **TR / EN** — auto-detected from the system, or set manually
- 🌈 **Color control** — auto-disabled when piped or when `NO_COLOR` is set
- 📘 **TypeScript types** included
- 💎 **Zero dependencies**

## 📦 Installation

```bash
npm install aiko.logger
```

Requires **Node.js 18+**.

## ⚡ Quick start

```js
const { Logger } = require('aiko.logger');

const logger = new Logger({ prefix: 'App', saveToFile: true });

logger.info('Server started on port', 3000);
logger.success('Database connected');
logger.warn('Slow query', { ms: 1280 });
logger.error('Request failed:', new Error('Timeout'));
```

## 🧩 Child loggers

```js
const logger = new Logger({ prefix: 'App', saveToFile: true });

const db  = logger.child('DB');     // [App:DB]
const api = logger.child('API');    // [App:API]

db.info('Connection established');
api.error('Unauthorized request');
```

Child loggers share log files, transports and the webhook queue with their parent.

## 🎚️ Log filtering

```js
const logger = new Logger({ minLevel: 'warn' });

logger.info('Not logged');
logger.error('Logged');
```

Level order: `debug` < `info` < `success` < `warn` < `error` = `logerr` < `fatal`

## 📦 JSON logging

```js
const logger = new Logger({ format: 'json', saveToFile: true, prefix: 'App' });
logger.info('System started');
```

`logs/INFO-01-01-2026.json`:

```json
{"timestamp":"2026-01-01T12:00:00.000Z","level":"INFO","message":"System started","prefix":"App"}
```

One JSON object per line (NDJSON), easy to parse or ship to a log service.

## 🔌 Custom transports

```js
logger.addTransport((log) => {
  // log: { level, label, message, timestamp, prefix }
  myDatabase.insert(log);
});
```

## 🚀 Discord webhook

```js
const logger = new Logger({
  webhookUrl: 'https://discord.com/api/webhooks/...',
  webhookMinLevel: 'error', // default: 'warn'
  prefix: 'MyBot'
});

logger.error('Payment failed', { orderId: 42 });
```

- Sent as an embed (emoji, level, prefix, timestamp)
- Requests are queued; HTTP 429 responses are retried using `Retry-After`
- Messages over 4000 characters are truncated; ``` inside messages can't break the code block

## 🧹 Auto cleanup

```js
const logger = new Logger({
  saveToFile: true,
  autoCleanup: true,
  keepLogsFor: 7 // days
});
```

Runs on startup and then every 24 hours. Only files named like `LEVEL-DD-MM-YYYY.log|json` are touched.

## 🛑 Graceful shutdown

Log files are written through async streams. Before exiting, flush pending writes and webhooks:

```js
process.on('SIGINT', async () => {
  await logger.close();
  process.exit(0);
});
```

## ⚙️ Options

| Option            | Type                      | Default     | Description                                              |
| ----------------- | ------------------------- | ----------- | -------------------------------------------------------- |
| `prefix`          | `string`                  | `null`      | Label added to every log                                 |
| `minLevel`        | `LogLevel`                | `'debug'`   | Ignore logs below this level                             |
| `format`          | `'text' \| 'json'`        | `'text'`    | File format                                              |
| `saveToFile`      | `boolean`                 | `false`     | Write logs to daily files                                |
| `logFolder`       | `string`                  | `'./logs'`  | Log directory (created automatically)                    |
| `autoCleanup`     | `boolean`                 | `false`     | Delete old log files                                     |
| `keepLogsFor`     | `number`                  | `0`         | Days to keep logs (used with `autoCleanup`)              |
| `webhookUrl`      | `string \| null`          | `null`      | Discord webhook URL                                      |
| `webhookMinLevel` | `LogLevel`                | `'warn'`    | Lowest level sent to the webhook                         |
| `language`        | `'tr' \| 'en'`            | auto        | Labels & messages language                               |
| `colors`          | `boolean \| 'auto'`       | `'auto'`    | Terminal colors (`NO_COLOR` / non-TTY aware)             |
| `silent`          | `boolean`                 | `false`     | No terminal output (files/webhook/transports still work) |

Invalid values never crash the logger: you get a warning and the default is used.

## 🧰 API

| Method                    | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `logger.<level>(...args)` | Log with any number of arguments                       |
| `logger.child(prefix)`    | New logger with an extended prefix                     |
| `logger.addTransport(fn)` | Register a custom transport                            |
| `await logger.close()`    | Flush webhooks, close file streams                     |

## ⚔️ Comparison

| Feature                    | aiko.logger | winston | pino |
| -------------------------- | :---------: | :-----: | :--: |
| Zero dependencies          |     ✅      |   ❌    |  ❌  |
| JSON logging               |     ✅      |   ✅    |  ✅  |
| Custom transports          |     ✅      |   ✅    |  ⚠️  |
| Built-in Discord webhook   |     ✅      |   ❌    |  ❌  |
| Built-in TR/EN labels      |     ✅      |   ❌    |  ❌  |

aiko.logger focuses on simplicity and small size. If you need extreme throughput or a huge plugin ecosystem, pino or winston may suit you better.

## 🧪 Development

```bash
npm test          # run tests (node:test)
npm run demo      # try it out
npm run benchmark # quick throughput check
```

## 🔄 Upgrading from 1.1.x

- Node.js **18+** is now required (global `fetch` is used for webhooks).
- Log methods accept multiple arguments: `logger.info('a', obj)`.
- Webhooks only fire for `warn` and above (same as before) — now configurable via `webhookMinLevel`.
- Call `await logger.close()` before `process.exit()` to avoid losing buffered logs.

## 📄 License

MIT
