const { Logger } = require('./index');
const logger = new Logger({
    saveToFile: true,
    logFolder: './logs',
    webhookUrl: '' 
});

console.log("==== STANDART LOG SEVİYELERİ ====");
logger.info('Aiko sistemi başarıyla başlatıldı.');
logger.success('Veritabanına güvenli bir şekilde bağlanıldı.');
logger.debug('Önbellek (Cache) temizlendi, 42ms sürdü.');
logger.warn('Gecikme süresi yüksek: 250ms sınırına yaklaşıldı!');
logger.error('Kullanıcı modülü yüklenirken beklenmeyen bir hata oluştu!');
logger.fatal('Sunucu çöküşü: Bellek sızıntısı (Memory Leak) tespit edildi!');

console.log("\n==== GLOBAL (İNGİLİZCE) KULLANIM TESTİ ====");
const enLogger = new Logger({
    language: 'en',
    saveToFile: true,
    logFolder: './logs-global'
});

enLogger.info('System has been initialized correctly.');
enLogger.fatal('Critical core failure detected!');
console.log("\n==== GELİŞMİŞ VERİ TİPLERİ TESTİ ====");
const fakeUser = {
    id: "9876543210",
    username: "Furki",
    badges: ["Developer", "Early Supporter"],
    isActive: true
};
logger.info(fakeUser); 
try {
  
    throw new Error("Discord API Rate Limit aşıldı!");
} catch (error) {
    logger.error(error); 
}