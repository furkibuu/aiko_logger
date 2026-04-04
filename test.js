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
    logFolder: './logs',
    // webhookUrl: 'false'
});


setTimeout(() => {
    console.log("\n==== 1. STANDART LOG SEVİYELERİ ====");
    logger.info('Aiko sistemi başarıyla başlatıldı (Asenkron Motor Aktif).');
    logger.success('Veritabanına milisaniyeler içinde bağlanıldı.');
    logger.debug('Önbellek temizlendi, disk performansı harika.');
    logger.warn('Gecikme süresi yüksek: 250ms sınırına yaklaşıldı!');
    logger.error('Kullanıcı modülü yüklenirken beklenmeyen bir hata oluştu!');
    logger.fatal('Sunucu çöküşü engellendi: Asenkron kurtarma devrede!');

const testObject = {
    botName: "Aiko",
    ping: 120,
    status: "Online",
    modules: ["Logger", "Database", "Canvas"]
};
logger.info(testObject);
try {
    throw new Error("API bağlantısı zaman aşımına uğradı (Timeout)!");
} catch (err) {
    logger.logerr(err); 
}
