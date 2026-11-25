# 🪵 aiko.logger

> Node.js için hafif, sıfır bağımlılıklı logger — renkli terminal çıktısı, günlük log dosyaları, JSON log, alt (child) logger'lar, özel transport'lar ve Discord webhook desteği.

🇬🇧 [English documentation](./README.md)

---

## ✨ Özellikler

- 🎨 **7 log seviyesi** — `debug`, `info`, `success`, `warn`, `error`, `logerr`, `fatal`
- 🧩 **Child logger** — `logger.child('DB')` → ön ek `App:DB`, dosya/webhook/transport paylaşılır
- 📁 **Günlük log dosyaları** — seviye başına günlük dosya, text veya JSON
- 🧹 **Otomatik temizlik** — eski log dosyalarını siler (yalnızca aiko.logger'ın oluşturduklarını)
- 🚀 **Discord webhook** — embed, kuyruk, 429 (rate limit) yeniden deneme, `webhookMinLevel`
- 🔌 **Özel transport** — logları istediğin yere gönder; hatalı transport uygulamayı çökertmez
- 🎚️ **Seviye filtreleme** — `minLevel`
- 🛡️ **Akıllı biçimlendirme** — obje, dizi, `Error` stack'i, çoklu argüman
- 🌐 **TR / EN** — sistemden otomatik algılanır veya elle seçilir
- 🌈 **Renk kontrolü** — çıktı yönlendirilince veya `NO_COLOR` varsa otomatik kapanır
- 📘 **TypeScript tipleri** dahil
- 💎 **Sıfır bağımlılık**

## 📦 Kurulum

```bash
npm install aiko.logger
```

**Node.js 18+** gerekir.

## ⚡ Hızlı başlangıç

```js
const { Logger } = require('aiko.logger');

const logger = new Logger({ prefix: 'App', saveToFile: true });

logger.info('Sunucu başladı, port:', 3000);
logger.success('Veritabanı bağlandı');
logger.warn('Yavaş sorgu', { ms: 1280 });
logger.error('İstek başarısız:', new Error('Zaman aşımı'));
```

## 🧩 Child logger

```js
const logger = new Logger({ prefix: 'App', saveToFile: true });

const db  = logger.child('DB');   // [App:DB]
const api = logger.child('API');  // [App:API]

db.info('Bağlantı kuruldu');
api.error('Yetkisiz istek');
```

## 🎚️ Seviye filtreleme

```js
const logger = new Logger({ minLevel: 'warn' });

logger.info('Loglanmaz');
logger.error('Loglanır');
```

Sıralama: `debug` < `info` < `success` < `warn` < `error` = `logerr` < `fatal`

## 📦 JSON log

```js
const logger = new Logger({ format: 'json', saveToFile: true, prefix: 'App' });
logger.info('Sistem başladı');
```

`logs/BİLGİ-01-01-2026.json` (dil Türkçe ise):

```json
{"timestamp":"2026-01-01T12:00:00.000Z","level":"BİLGİ","message":"Sistem başladı","prefix":"App"}
```

## 🔌 Özel transport

```js
logger.addTransport((log) => {
  // log: { level, label, message, timestamp, prefix }
  veritabani.ekle(log);
});
```

## 🚀 Discord webhook

```js
const logger = new Logger({
  webhookUrl: 'https://discord.com/api/webhooks/...',
  webhookMinLevel: 'error', // varsayılan: 'warn'
  prefix: 'Botum'
});

logger.error('Ödeme başarısız', { siparisId: 42 });
```

## 🧹 Otomatik temizlik

```js
const logger = new Logger({
  saveToFile: true,
  autoCleanup: true,
  keepLogsFor: 7 // gün
});
```

Başlangıçta ve sonra her 24 saatte bir çalışır. Yalnızca `SEVİYE-GG-AA-YYYY.log|json` biçimindeki dosyalara dokunur.

## 🛑 Düzgün kapatma

Dosya yazımı asenkron stream ile yapılır. Çıkmadan önce bekleyen yazımları ve webhook'ları tamamla:

```js
process.on('SIGINT', async () => {
  await logger.close();
  process.exit(0);
});
```

## ⚙️ Seçenekler

| Seçenek           | Tip                 | Varsayılan  | Açıklama                                                   |
| ----------------- | ------------------- | ----------- | ---------------------------------------------------------- |
| `prefix`          | `string`            | `null`      | Her loga eklenen etiket                                    |
| `minLevel`        | `LogLevel`          | `'debug'`   | Bu seviyenin altı yok sayılır                              |
| `format`          | `'text' \| 'json'`  | `'text'`    | Dosya formatı                                              |
| `saveToFile`      | `boolean`           | `false`     | Günlük dosyalara yaz                                       |
| `logFolder`       | `string`            | `'./logs'`  | Log klasörü (otomatik oluşturulur)                         |
| `autoCleanup`     | `boolean`           | `false`     | Eski logları sil                                           |
| `keepLogsFor`     | `number`            | `0`         | Kaç gün saklanacağı (`autoCleanup` ile)                    |
| `webhookUrl`      | `string \| null`    | `null`      | Discord webhook URL'si                                     |
| `webhookMinLevel` | `LogLevel`          | `'warn'`    | Webhook'a gidecek en düşük seviye                          |
| `language`        | `'tr' \| 'en'`      | otomatik    | Etiket ve mesaj dili                                       |
| `colors`          | `boolean \| 'auto'` | `'auto'`    | Terminal renkleri                                          |
| `silent`          | `boolean`           | `false`     | Terminale yazma (dosya/webhook/transport çalışmaya devam)  |

Geçersiz değerler logger'ı çökertmez: uyarı verilir ve varsayılan kullanılır.

## 🧰 API

| Metot                     | Açıklama                                      |
| ------------------------- | --------------------------------------------- |
| `logger.<seviye>(...args)`| Sınırsız argümanla log                        |
| `logger.child(prefix)`    | Ön eki genişletilmiş yeni logger              |
| `logger.addTransport(fn)` | Özel transport ekler                          |
| `await logger.close()`    | Webhook'ları gönderir, dosyaları kapatır      |

## 🧪 Geliştirme

```bash
npm test          # testleri çalıştır
npm run demo      # dene
npm run benchmark # hızlı performans ölçümü
```

## 🔄 1.1.x'ten yükseltme

- Artık **Node.js 18+** gerekir (webhook için global `fetch` kullanılır).
- Log metotları çoklu argüman alır: `logger.info('a', obj)`.
- Webhook yine `warn` ve üstünde çalışır, artık `webhookMinLevel` ile ayarlanabilir.
- `process.exit()` öncesinde `await logger.close()` çağır, aksi halde bekleyen loglar kaybolabilir.

## 📄 Lisans

MIT
