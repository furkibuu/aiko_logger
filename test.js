const fs = require('fs');
const path = require('path');
const { Logger } = require('./index');
const logDir = './logs';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const fakeOldFile = path.join(logDir, 'BİLGİ-Eski-Test.log');
fs.writeFileSync(fakeOldFile, '[Eski Log] Bu dosya sistem tarafından otomatik silinmeli.\n');
const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
fs.utimesSync(fakeOldFile, fiveDaysAgo, fiveDaysAgo);

console.log("⏳ Test ortamı hazırlandı. Eski log dosyası simüle edildi...\n");

// =====================================================================
// 🚀 AIKO LOGGER TESTİ
// =====================================================================


const logger = new Logger({
    saveToFile: true,
    logFolder: logDir,
    keepLogsFor: 3,       
    autoCleanup: true,  
    // webhookUrl: 'YOUR_DISCORD_WEBHOOK_URL', 
});


setTimeout(() => {
    console.log("\n==== 1. STANDART LOG SEVİYELERİ ====");
    logger.info('Aiko sistemi başarıyla başlatıldı (Asenkron Motor Aktif).');
    logger.success('Veritabanına milisaniyeler içinde bağlanıldı.');
    logger.debug('Önbellek temizlendi, disk performansı harika.');
    logger.warn('Gecikme süresi yüksek: 250ms sınırına yaklaşıldı!');
    logger.error('Kullanıcı modülü yüklenirken beklenmeyen bir hata oluştu!');
    logger.fatal('Sunucu çöküşü engellendi: Asenkron kurtarma devrede!');

    console.log("\n==== 2. ÖZEL LACİVERT LOG (LOGERR) ====");
    logger.logerr('Sistemsel altyapı hatası: Veritabanı senkronizasyonu koptu!');

    console.log("\n==== 3. GELİŞMİŞ VERİ TİPLERİ TESTİ ====");
    const testObject = {
        botName: "Anju",
        ping: 42,
        status: "Online",
        modules: ["Logger", "Auto-Cleanup", "Asenkron Yazma"]
    };
    logger.info(testObject);
    try {
        throw new Error("Discord API Rate Limit aşıldı (Timeout)!");
    } catch (err) {
        logger.logerr(err); 
    }

    console.log("\n✅ Test tamamlandı! 'logs' klasörüne bakarsan sadece bugünün loglarını göreceksin.");
}, 100);