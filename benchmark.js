const { Logger } = require('./index');
const logger = new Logger({ saveToFile: false });

const ITERATIONS = 10000;

console.log(`🚀 ${ITERATIONS} log için Benchmark başlatılıyor...`);

console.time('Benchmark Süresi');

for (let i = 0; i < ITERATIONS; i++) {
    logger.info(`Test log mesajı #${i}`);
}

console.timeEnd('Benchmark Süresi');
console.log("------------------------------------------");
console.log("Not: Loglar asenkron yazıldığı için terminal akışı bittikten sonra bile arkaplanda işlem devam edebilir.");