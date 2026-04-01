const { Logger } = require('./index');
const logger = new Logger({
    saveToFile: true,
    logFolder: './logs',
    // webhookUrl: 'false'
});

console.log("==== 1. STANDART LOG SEVİYELERİ ====");
logger.info('Aiko sistemi başarıyla başlatıldı.');
logger.success('Veritabanına güvenli bir şekilde bağlanıldı.');
logger.debug('Önbellek (Cache) temizlendi, 42ms sürdü.');
logger.warn('Gecikme süresi yüksek: 250ms sınırına yaklaşıldı!');
logger.error('Kullanıcı modülü yüklenirken beklenmeyen bir hata oluştu!');
logger.fatal('Sunucu çöküşü: Bellek sızıntısı (Memory Leak) tespit edildi!');
console.log("\n==== 2. YENİ ÖZEL METOT: logerr ====");
logger.logerr('Sistemsel altyapı hatası: Veritabanı senkronizasyonu koptu!');

console.log("\n==== 3. GELİŞMİŞ VERİ TİPLERİ TESTİ ====");

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
