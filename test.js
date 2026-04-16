// test.js
const { Logger } = require('./index');

// ---------------------------------------------------------
// SENARYO 1: JSON Formatı ve Dosya Kaydı
// ---------------------------------------------------------
const jsonLogger = new Logger({
    saveToFile: true,
    format: 'json',
    logFolder: './logs/json_logs'
});

console.log("==== 1. JSON FORMAT TESTİ ====");
jsonLogger.info("Bu mesaj dosyaya JSON olarak kaydedilecek.");
jsonLogger.success({ status: "success", code: 200, message: "API Yanıtı" });


// ---------------------------------------------------------
// SENARYO 2: Log Seviyesi Filtreleme (minLevel)
// ---------------------------------------------------------
const filteredLogger = new Logger({
    minLevel: 'error'
});

console.log("\n==== 2. SEVİYE FİLTRELEME TESTİ (Min: ERROR) ====");
filteredLogger.info("Bu mesaj GÖRÜNMEYECEK (info < error)");
filteredLogger.warn("Bu mesaj GÖRÜNMEYECEK (warn < error)");
filteredLogger.error("Bu mesaj GÖRÜNECEK!");
filteredLogger.fatal("Bu mesaj da GÖRÜNECEK!");


// ---------------------------------------------------------
// SENARYO 3: Eklenti (Custom Transport) Sistemi
// ---------------------------------------------------------
const transportLogger = new Logger();

transportLogger.addTransport((data) => {
    console.log(`\x1b[33m[EKLEMTI TETİKLENDİ]\x1b[0m Gelen Seviye: ${data.level} | Mesaj: ${data.message}`);
});

console.log("\n==== 3. CUSTOM TRANSPORT TESTİ ====");
transportLogger.info("Eklenti sistemi bu mesajı yakalayacak.");


// ---------------------------------------------------------
// SENARYO 4: Özel Lacivert Log (logerr)
// ---------------------------------------------------------
console.log("\n==== 4. ÖZEL LACİVERT LOG TESTİ ====");
transportLogger.logerr("Kritik veritabanı senkronizasyon hatası!");