const { Logger } = require('./index');

const logger = new Logger({
    saveToFile: true,
    logFolder: './logs',
    webhookUrl: 'https://discord.com/api/webhooks/1483204995783590058/KGyCjyJBm0WyXrCYf5HSie9diCKuMJB5aNcqlHxPAGvwAK8sb3OKFzpJW7UHzFTleusN'
});

logger.info('Sistem başlatılıyor...');
logger.success('Modüller yüklendi.');

// Bu iki mesaj otomatik olarak Discord kanalına Embed olarak düşecek!
logger.warn('Gecikme süresi 300ms sınırını aştı.');
logger.error('Veritabanı bağlantısı koptu! Sistem durduruluyor.');