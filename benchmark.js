const { Logger } = require('./index');

const ITERATIONS = 10000;

function run(name, logger) {
    const start = process.hrtime.bigint();
    for (let i = 0; i < ITERATIONS; i++) logger.info(`Test log mesajı #${i}`);
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.error(`${name.padEnd(28)} ${ms.toFixed(1)} ms  (${Math.round(ITERATIONS / (ms / 1000))} log/sn)`);
}

(async () => {
    console.error(`🚀 ${ITERATIONS} log için benchmark başlıyor...\n`);

  
    run('silent', new Logger({ silent: true }));

    const file = new Logger({ silent: true, saveToFile: true, logFolder: './logs-benchmark' });
    run('silent + dosyaya yazma', file);
    await file.close();

    console.error('\nNot: Dosya yazımı asenkron stream ile yapılır; close() bekleyen yazımları tamamlar.');
})();
