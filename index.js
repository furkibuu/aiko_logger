'use strict';

const fs = require('fs');
const path = require('path');
const { colors, noColors, shouldUseColors } = require('./colors/colors');
const { locales } = require('./locales/locales');
const { detectLanguage, getTimestamp, getDateStamp, stripColors, formatArgs, truncate, escapeCodeBlock, sleep } = require('./utils/helpers');
const { validateLevel, validateLanguage, validateFormat, validateWebhookUrl } = require('./utils/validators');

const LEVEL_HIERARCHY = { debug: 1, info: 2, success: 3, warn: 4, error: 5, logerr: 5, fatal: 6 };


const WEBHOOK_STYLE = {
    debug:   { emoji: '🐛', color: 9807270 },
    info:    { emoji: 'ℹ️', color: 3447003 },
    success: { emoji: '✅', color: 3066993 },
    warn:    { emoji: '⚠️', color: 16776960 },
    error:   { emoji: '❌', color: 15158332 },
    logerr:  { emoji: '⚙️', color: 15158332 },
    fatal:   { emoji: '🚨', color: 16711680 }
};

const DAY_MS = 24 * 60 * 60 * 1000;
const LOG_FILE_PATTERN = /-\d{2}-\d{2}-\d{4}\.(log|json)$/; 
const MAX_WEBHOOK_QUEUE = 50;
const MAX_WEBHOOK_RETRIES = 3;

class Logger {
    constructor(options = {}) {
        const targetLang = validateLanguage(options.language, locales) ? options.language : null;
        this.lang = detectLanguage(targetLang, locales);
        this.t = locales[this.lang];

        const levelOk = validateLevel(options.minLevel, LEVEL_HIERARCHY, this.t);
        const webhookLevelOk = validateLevel(options.webhookMinLevel, LEVEL_HIERARCHY, this.t);
        const formatOk = validateFormat(options.format, this.t);
        const webhookOk = validateWebhookUrl(options.webhookUrl, this.t);
        const keepLogsFor = Number(options.keepLogsFor);

        this.config = {
            saveToFile: Boolean(options.saveToFile),
            logFolder: options.logFolder || './logs',
            webhookUrl: webhookOk ? options.webhookUrl || null : null,
            webhookMinLevel: webhookLevelOk && options.webhookMinLevel ? options.webhookMinLevel : 'warn',
            keepLogsFor: keepLogsFor > 0 ? keepLogsFor : 0,
            autoCleanup: Boolean(options.autoCleanup),
            minLevel: levelOk && options.minLevel ? options.minLevel : 'debug',
            format: formatOk && options.format ? options.format : 'text',
            prefix: options.prefix || null,
            silent: Boolean(options.silent)
        };

        const useColors = options.colors === undefined || options.colors === 'auto'
            ? shouldUseColors()
            : Boolean(options.colors);
        this.useColors = useColors;
        this.c = useColors ? colors : noColors;

        this._isChild = Boolean(options._shared);
        this._shared = options._shared || {
            streams: {},
            transports: [],
            folderReady: false,
            fileDisabled: false,
            webhookQueue: [],
            webhookBusy: false,
            cleanupTimer: null
        };
        this.streams = this._shared.streams;
        this.transports = this._shared.transports;

        if (!this._isChild && this.config.autoCleanup && this.config.keepLogsFor > 0) {
            this._cleanupLogs();
            this._shared.cleanupTimer = setInterval(() => this._cleanupLogs(), DAY_MS);
            this._shared.cleanupTimer.unref();
        }
    }

    child(prefix) {
        const combined = this.config.prefix ? `${this.config.prefix}:${prefix}` : String(prefix);
        return new Logger({
            ...this.config,
            language: this.lang,
            colors: this.useColors,
            prefix: combined,
            _shared: this._shared
        });
    }

    addTransport(transportFunc) {
        if (typeof transportFunc === 'function') {
            this.transports.push(transportFunc);
        } else {
            console.log(`${this.c.red}[LOGGER ERROR]${this.c.reset} ${this.t.messages.transportInvalid}`);
        }
    }

    _internalError(message, err) {
        const detail = err && err.message ? `: ${err.message}` : '';
        console.log(`${this.c.red}[LOGGER ERROR]${this.c.reset} ${message}${detail}`);
    }

    _shouldLog(level) {
        const min = LEVEL_HIERARCHY[this.config.minLevel] || 1;
        return (LEVEL_HIERARCHY[level] || 1) >= min;
    }

    _shouldSendWebhook(level) {
        if (!this.config.webhookUrl) return false;
        return (LEVEL_HIERARCHY[level] || 1) >= LEVEL_HIERARCHY[this.config.webhookMinLevel];
    }

    _getStream(typeLabel) {
        const shared = this._shared;
        if (!this.config.saveToFile || shared.fileDisabled) return null;

        if (!shared.folderReady) {
            try {
                fs.mkdirSync(this.config.logFolder, { recursive: true });
                shared.folderReady = true;
            } catch (err) {
                shared.fileDisabled = true;
                this._internalError(this.t.messages.folderError, err);
                return null;
            }
        }

        const date = getDateStamp();
        const ext = this.config.format === 'json' ? 'json' : 'log';
        const fileName = `${typeLabel}-${date}.${ext}`;

        if (shared.streams[fileName]) return shared.streams[fileName].stream;


        for (const [name, entry] of Object.entries(shared.streams)) {
            if (entry.date !== date) {
                entry.stream.end();
                delete shared.streams[name];
            }
        }

        const stream = fs.createWriteStream(path.join(this.config.logFolder, fileName), {
            flags: 'a',
            encoding: 'utf8'
        });
        stream.on('error', (err) => {
            this._internalError(this.t.messages.fileError, err);
            delete shared.streams[fileName]; 
        });

        shared.streams[fileName] = { stream, date };
        return stream;
    }

    _writeToFile(labelKey, cleanMessage, isoTime) {
        if (!this.config.saveToFile) return;

        const typeLabel = this.t.labels[labelKey];
        const stream = this._getStream(typeLabel);
        if (!stream) return;

        let logLine;
        if (this.config.format === 'json') {
            const payload = { timestamp: isoTime, level: typeLabel, message: cleanMessage };
            if (this.config.prefix) payload.prefix = this.config.prefix;
            logLine = JSON.stringify(payload) + '\n';
        } else {
            const prefixStr = this.config.prefix ? `[${this.config.prefix}] ` : '';
            logLine = `[${getTimestamp(this.t.dateLocale)}] ${prefixStr}[${typeLabel}] ${cleanMessage}\n`;
        }
        stream.write(logLine);
    }

    async _cleanupLogs() {
        try {
            const folder = this.config.logFolder;
            let files;
            try {
                files = await fs.promises.readdir(folder);
            } catch (err) {
                if (err.code === 'ENOENT') return;
                throw err;
            }

            const now = Date.now();
            for (const file of files) {
                if (!LOG_FILE_PATTERN.test(file)) continue;

                const filePath = path.join(folder, file);
                const stats = await fs.promises.stat(filePath);
                if (!stats.isFile()) continue;

                if ((now - stats.mtimeMs) / DAY_MS > this.config.keepLogsFor) {
                    const entry = this._shared.streams[file];
                    if (entry) {
                        entry.stream.end();
                        delete this._shared.streams[file];
                    }
                    await fs.promises.unlink(filePath);
                    console.log(`${this.c.gray}[LOGGER]${this.c.reset} ${this.c.yellow}${this.t.messages.cleanupSuccess}: ${file}${this.c.reset}`);
                }
            }
        } catch (err) {
            this._internalError(this.t.messages.cleanupError, err);
        }
    }

    _enqueueWebhook(labelKey, cleanMessage, isoTime) {
        const style = WEBHOOK_STYLE[labelKey];
        const typeLabel = this.t.labels[labelKey];
        const prefixPart = this.config.prefix ? ` [${this.config.prefix}]` : '';
        const safeMessage = escapeCodeBlock(truncate(cleanMessage, 3900));

        const embed = {
            title: `${style.emoji}${prefixPart} ${typeLabel}`,
            description: `**${this.t.messages.logDetail}:**\n\`\`\`\n${safeMessage}\n\`\`\``,
            color: style.color,
            timestamp: isoTime
        };

        const queue = this._shared.webhookQueue;
        if (queue.length >= MAX_WEBHOOK_QUEUE) queue.shift(); 
        queue.push({
            url: this.config.webhookUrl,
            body: JSON.stringify({ username: 'aiko.logger', embeds: [embed] }),
            tries: 0
        });

        if (!this._shared.webhookBusy) this._drainWebhook();
    }

    async _drainWebhook() {
        const shared = this._shared;
        shared.webhookBusy = true;
        try {
            while (shared.webhookQueue.length > 0) {
                const job = shared.webhookQueue.shift();
                try {
                    const res = await fetch(job.url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: job.body,
                        signal: AbortSignal.timeout(10000)
                    });

                    if (res.status === 429 && job.tries < MAX_WEBHOOK_RETRIES) {
                        job.tries++;
                        const retryAfter = Number(res.headers.get('retry-after')) || 1;
                        shared.webhookQueue.unshift(job);
                        await sleep(Math.min(retryAfter, 10) * 1000);
                        continue;
                    }
                    if (!res.ok) {
                        this._internalError(`${this.t.messages.webhookRejected} (HTTP ${res.status})`);
                    }
                } catch (err) {
                    this._internalError(this.t.messages.webhookError, err);
                }
            }
        } finally {
            shared.webhookBusy = false;
        }
    }

    _print(labelKey, colorName, args) {
        if (!this._shouldLog(labelKey)) return;

        const formatted = formatArgs(args);
        const cleanMessage = stripColors(formatted);
        const typeLabel = this.t.labels[labelKey];
        const isoTime = new Date().toISOString();

        if (!this.config.silent) {
            const c = this.c;
            const typeDisplay = labelKey === 'fatal'
                ? `${c.bgRed}${c.white}[${typeLabel}]${c.reset}`
                : `${c[colorName]}[${typeLabel}]${c.reset}`;
            const prefixStr = this.config.prefix ? `${c.gray}[${this.config.prefix}]${c.reset} ` : '';
            console.log(`${c.gray}[${getTimestamp(this.t.dateLocale)}]${c.reset} ${prefixStr}${typeDisplay} ${formatted}`);
        }

        this._writeToFile(labelKey, cleanMessage, isoTime);
        if (this._shouldSendWebhook(labelKey)) this._enqueueWebhook(labelKey, cleanMessage, isoTime);

        if (this.transports.length > 0) {
            const transportData = {
                level: labelKey,
                label: typeLabel,
                message: cleanMessage,
                timestamp: isoTime,
                prefix: this.config.prefix
            };
            setImmediate(() => {
                for (const transport of this.transports) {
                    try {
                        transport(transportData);
                    } catch (err) {
                        this._internalError(this.t.messages.transportError, err);
                    }
                }
            });
        }
    }

  
    async close() {
        if (this._isChild) return;
        const shared = this._shared;

        if (shared.cleanupTimer) {
            clearInterval(shared.cleanupTimer);
            shared.cleanupTimer = null;
        }

        const deadline = Date.now() + 5000;
        while ((shared.webhookBusy || shared.webhookQueue.length > 0) && Date.now() < deadline) {
            await sleep(50);
        }

        const entries = Object.entries(shared.streams);
        for (const [name] of entries) delete shared.streams[name];

        await Promise.all(entries.map(([, entry]) => new Promise((resolve) => {
            entry.stream.once('error', resolve);
            entry.stream.end(resolve);
        })));
    }

    info(...args)    { this._print('info', 'cyan', args); }
    success(...args) { this._print('success', 'green', args); }
    debug(...args)   { this._print('debug', 'magenta', args); }
    warn(...args)    { this._print('warn', 'yellow', args); }
    error(...args)   { this._print('error', 'red', args); }
    fatal(...args)   { this._print('fatal', 'bgRed', args); }
    logerr(...args)  { this._print('logerr', 'dark_blue', args); }
}

module.exports = { Logger };
