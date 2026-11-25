'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { Logger } = require('../index');

const tick = () => new Promise((resolve) => setImmediate(() => setImmediate(resolve)));
const tmpDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'aiko-logger-'));

function captureConsole(fn) {
    const original = console.log;
    const lines = [];
    console.log = (...a) => lines.push(a.join(' '));
    try { fn(); } finally { console.log = original; }
    return lines;
}

test('minLevel altındaki loglar yok sayılır', async () => {
    const logger = new Logger({ minLevel: 'warn', silent: true, language: 'en' });
    const received = [];
    logger.addTransport((d) => received.push(d.level));

    logger.info('görünmez');
    logger.warn('görünür');
    logger.error('görünür');
    await tick();

    assert.deepStrictEqual(received, ['warn', 'error']);
});

test('geçersiz seviye/dil/format uyarı verir ve varsayılana döner', () => {
    let logger;
    const lines = captureConsole(() => {
        logger = new Logger({ minLevel: 'zort', language: 'fr', format: 'xml', silent: true });
    });
    assert.strictEqual(logger.config.minLevel, 'debug');
    assert.strictEqual(logger.config.format, 'text');
    assert.ok(lines.length >= 3);
});

test('çoklu argüman, obje ve Error biçimlenir', async () => {
    const logger = new Logger({ silent: true, language: 'en' });
    const received = [];
    logger.addTransport((d) => received.push(d.message));

    logger.info('kullanıcı', { id: 1 }, 42);
    logger.error(new Error('patladı'));
    await tick();

    assert.strictEqual(received[0], 'kullanıcı { id: 1 } 42');
    assert.ok(received[1].includes('patladı'));
});

test('child() ön eki birleştirir ve transportları paylaşır', async () => {
    const parent = new Logger({ prefix: 'App', silent: true, language: 'en' });
    const received = [];
    parent.addTransport((d) => received.push(d.prefix));

    parent.child('DB').info('x');
    await tick();

    assert.deepStrictEqual(received, ['App:DB']);
});

test('bozuk transport uygulamayı çökertmez', async () => {
    const logger = new Logger({ silent: true, language: 'en', colors: false });
    logger.addTransport(() => { throw new Error('boom'); });
    const lines = captureConsole(() => logger.info('x'));
    await new Promise((resolve) => setImmediate(resolve));
    assert.ok(Array.isArray(lines));
});

test('JSON formatında dosyaya yazar', async () => {
    const dir = tmpDir();
    const logger = new Logger({ saveToFile: true, logFolder: dir, format: 'json', prefix: 'T', silent: true, language: 'en' });

    logger.info('merhaba');
    await logger.close();

    const files = fs.readdirSync(dir);
    assert.strictEqual(files.length, 1);
    assert.match(files[0], /^INFO-\d{2}-\d{2}-\d{4}\.json$/);

    const entry = JSON.parse(fs.readFileSync(path.join(dir, files[0]), 'utf8').trim());
    assert.strictEqual(entry.level, 'INFO');
    assert.strictEqual(entry.message, 'merhaba');
    assert.strictEqual(entry.prefix, 'T');
    fs.rmSync(dir, { recursive: true, force: true });
});

test('autoCleanup yalnızca eski ve logger formatındaki dosyaları siler', async () => {
    const dir = tmpDir();
    const oldLog = path.join(dir, 'INFO-01-01-2020.log');
    const newLog = path.join(dir, 'INFO-01-01-2099.log');
    const foreign = path.join(dir, 'notes.log');
    for (const f of [oldLog, newLog, foreign]) fs.writeFileSync(f, 'x');
    const past = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    fs.utimesSync(oldLog, past, past);
    fs.utimesSync(foreign, past, past);

    const logger = new Logger({ logFolder: dir, keepLogsFor: 7, silent: true, language: 'en', colors: false });
    captureConsole(() => {});
    const original = console.log;
    console.log = () => {};
    try { await logger._cleanupLogs(); } finally { console.log = original; }

    assert.ok(!fs.existsSync(oldLog), 'eski log silinmeli');
    assert.ok(fs.existsSync(newLog), 'yeni log kalmalı');
    assert.ok(fs.existsSync(foreign), 'yabancı dosyaya dokunulmamalı');
    fs.rmSync(dir, { recursive: true, force: true });
});

test('webhook yalnızca webhookMinLevel ve üstünde gönderilir', async () => {
    const bodies = [];
    const server = http.createServer((req, res) => {
        let data = '';
        req.on('data', (chunk) => { data += chunk; });
        req.on('end', () => { bodies.push(JSON.parse(data)); res.writeHead(204); res.end(); });
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}/hook`;

    const logger = new Logger({ webhookUrl: url, silent: true, language: 'en', prefix: 'Hook' });
    logger.info('gönderilmez');
    logger.error('gönderilir ``` kod bloğu');
    await logger.close();
    server.close();

    assert.strictEqual(bodies.length, 1);
    const embed = bodies[0].embeds[0];
    assert.ok(embed.title.includes('[Hook]'));
    assert.ok(embed.title.includes('ERROR'));
    // iç içe ``` kod bloğunu bozmamalı: yalnızca açılış + kapanış kalmalı
    assert.strictEqual((embed.description.match(/```/g) || []).length, 2);
});

test('geçersiz webhook URL devre dışı bırakılır', () => {
    let logger;
    captureConsole(() => { logger = new Logger({ webhookUrl: 'not-a-url', silent: true, language: 'en' }); });
    assert.strictEqual(logger.config.webhookUrl, null);
});
