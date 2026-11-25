const { Logger } = require('../index');


const bad = new Logger({ minLevel: 'zort', language: 'fr' });
bad.info('Bağlantı kuruldu.');

const web = new Logger({ prefix: 'Express.js', minLevel: 'warn' });
web.info('Bu mesaj loglanmayacak.');
web.error('API isteği zaman aşımına uğradı!');


const db = web.child('MongoDB');
db.warn('Yavaş sorgu', { ms: 1280, collection: 'users' });

web.error('İşlem başarısız:', new Error('Beklenmeyen hata'));


web.close();
