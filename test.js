const { Logger } = require('./index');
const dbLogger = new Logger({ minLevel: 'zort', language: 'fr' });

dbLogger.info('Bağlantı kuruldu.');
dbLogger.success('Kullanıcı şeması yüklendi.');

const webLogger = new Logger({ prefix: 'Express.js', minLevel: 'warn' });
webLogger.info('Bu mesaj loglanmayacak.'); 
webLogger.error('API isteği zaman aşımına uğradı!');