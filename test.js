const { Logger } = require('./index');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------
// SENARYO 1: Standart Metin Loglama ve Otomatik Temizlik
// ---------------------------------------------------------
const logger = new Logger({
    saveToFile: true,
    logFolder: './logs/text_logs',
    keepLogsFor: 1, // 1 günden eski logları temizle
    autoCleanup: true
});

console.log("==== 1. STANDART METİN LOG TESTİ ====");
logger.info('Aiko modüler sistem başarıyla yüklendi.');
logger.success('Helpers.js üzerinden formatlama yapıldı.');
logger.debug('Geliştirici modu aktif.'); // Mor renkli


// ---------------------------------------------------------
// SENARYO 2: JSON Formatı Testi
// ---------------------------------------------------------
const jsonLogger = new Logger({
    saveToFile: true,
    format: 'json',
    logFolder: './logs/json_logs'
});

console.log("\n==== 2. JSON FORMAT TESTİ ====");
jsonLogger.info("Bu mesaj dosyaya JSON olarak yazılacak.");
jsonLogger.success({ database: "connected", ping: "14ms", status: "stable" });


// ---------------------------------------------------------
// SENARYO 3: MinLevel (Filtreleme) Testi
// ---------------------------------------------------------
const filteredLogger = new Logger({
    minLevel: 'warn' // Sadece 'warn' ve üzerini (warn, error, fatal, logerr) basar
});

console.log("\n==== 3. SEVİYE FİLTRELEME TESTİ (Min: WARN) ====");
filteredLogger.info("BU GÖRÜNMEYECEK");   // Seviye 2 (Filtrelendi)
filteredLogger.warn("BU GÖRÜNECEK!");      // Seviye 4 (Geçti)
filteredLogger.error("Kritik hata uyarısı!"); // Seviye 5 (Geçti)


// ---------------------------------------------------------
// SENARYO 4: Eklenti (Custom Transport) Sistemi
// ---------------------------------------------------------
const transportLogger = new Logger();

// Kendi eklentimizi ekleyelim (Logları terminale sarı renkle ekstradan basar)
transportLogger.addTransport((data) => {
    console.log(`\x1b[33m[EKLEMTI TETİKLENDİ]\x1b[0m Mesaj: ${data.message} | Zaman: ${data.timestamp}`);
});

console.log("\n==== 4. CUSTOM TRANSPORT TESTİ ====");
transportLogger.logerr("Lacivert log hatası ve eklenti testi!");


console.log("\n✅ Testler tamamlandı. './logs' klasörünü kontrol edebilirsin.");