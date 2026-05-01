const fs = require('fs');
const path = require('path');
const { colors } = require('./colors/colors');
const { locales } = require('./locales/locales');
const { detectLanguage, getTimestamp, stripColors, formatMessage } = require('./utils/helpers');
const { validateLevel, validateLanguage } = require('./utils/validators'); 

const LEVEL_HIERARCHY = { debug: 1, info: 2, success: 3, warn: 4, error: 5, logerr: 5, fatal: 6 };

class Logger {
    constructor(options = {}) {
        const isValidLang = validateLanguage(options.language, locales);
        const targetLang = isValidLang ? options.language : null;
        this.lang = detectLanguage(targetLang, locales);
        this.t = locales[this.lang]; 
        const isValidLevel = validateLevel(options.minLevel, LEVEL_HIERARCHY, this.t);
        const safeMinLevel = isValidLevel && options.minLevel ? options.minLevel : 'debug';
        this.config = {
            saveToFile: options.saveToFile || false,
            logFolder: options.logFolder || './logs',
            webhookUrl: options.webhookUrl || null,
            keepLogsFor: options.keepLogsFor || 0, 
            autoCleanup: options.autoCleanup || false,
            minLevel: safeMinLevel,
            format: options.format || 'text',
            prefix: options.prefix || null 
        };

        this.transports = [];
        this.streams = {};

        if (this.config.autoCleanup && this.config.keepLogsFor > 0) {
            this._cleanupLogs();
        }
    }

    addTransport(transportFunc) {
        if (typeof transportFunc === 'function') {
            this.transports.push(transportFunc);
        } else {
            console.log(`${colors.red}[LOGGER ERROR]${colors.reset} Transport must be a function.`);
        }
    }

    _shouldLog(currentLevel) {
        const minLevelWeight = LEVEL_HIERARCHY[this.config.minLevel] || 1;
        const currentLevelWeight = LEVEL_HIERARCHY[currentLevel] || 1;
        return currentLevelWeight >= minLevelWeight;
    }

    _getStream(typeLabel) {
        if (!this.config.saveToFile) return null;

        if (!fs.existsSync(this.config.logFolder)) {
            fs.mkdirSync(this.config.logFolder, { recursive: true });
        }

        const dateStr = new Date().toLocaleDateString('tr-TR').replace(/\./g, '-');
        const fileExt = this.config.format === 'json' ? 'json' : 'log';
        const fileName = `${typeLabel}-${dateStr}.${fileExt}`;
        const filePath = path.join(this.config.logFolder, fileName);

        if (this.streams[fileName]) {
            return this.streams[fileName];
        }

        const stream = fs.createWriteStream(filePath, { flags: 'a', encoding: 'utf8' });
   
        stream.on('error', (err) => {
            console.log(`${colors.red}[LOGGER STREAM ERROR]${colors.reset} ${this.t.messages.fileError}: ${err.message}`);
        });

        this.streams[fileName] = stream;
        return stream;
    }

    _writeToFile(labelKey, cleanMessage) {
        if (!this.config.saveToFile) return;

        const typeLabel = this.t.labels[labelKey];
        const stream = this._getStream(typeLabel);
        
        if (!stream) return;

        let logLine;
        if (this.config.format === 'json') {
            const jsonPayload = {
                timestamp: new Date().toISOString(),
                level: typeLabel,
                message: cleanMessage
            };
            if (this.config.prefix) jsonPayload.prefix = this.config.prefix;
            logLine = JSON.stringify(jsonPayload) + '\n';
        } else {
            const prefixStr = this.config.prefix ? `[${this.config.prefix}] ` : '';
            logLine = `[${getTimestamp(this.t.dateLocale)}] ${prefixStr}[${typeLabel}] ${cleanMessage}\n`;
        }

        stream.write(logLine);
    }

    async _cleanupLogs() {
        try {
            if (!fs.existsSync(this.config.logFolder)) return;

            const files = await fs.promises.readdir(this.config.logFolder);
            const now = Date.now();
            const msInDay = 24 * 60 * 60 * 1000;

            for (const file of files) {
                const filePath = path.join(this.config.logFolder, file);
                const stats = await fs.promises.stat(filePath);
                const ageInDays = (now - stats.mtimeMs) / msInDay;

                if (ageInDays > this.config.keepLogsFor) {
                    if (this.streams[file]) {
                        this.streams[file].end();
                        delete this.streams[file];
                    }
                    
                    await fs.promises.unlink(filePath);
                    console.log(`${colors.gray}[LOGGER]${colors.reset} ${colors.yellow}${this.t.messages.cleanupSuccess}: ${file}${colors.reset}`);
                }
            }
        } catch (err) {
            console.log(`${colors.red}[CLEANUP ERROR]${colors.reset} ${this.t.messages.cleanupError}: ${err.message}`);
        }
    }

    async _sendToWebhook(labelKey, cleanMessage, embedColor) {
        if (!this.config.webhookUrl) return;
        const safeMessage = cleanMessage.length > 4000 ? cleanMessage.substring(0, 3995) + '...' : cleanMessage;
        const typeLabel = this.t.labels[labelKey];
        const titleStr = this.config.prefix ? `🚨 [${this.config.prefix}] ${typeLabel}` : `🚨 ${typeLabel}`;

        const embed = {
            title: titleStr,
            description: `**${this.t.messages.logDetail}:**\n\`\`\`${safeMessage}\`\`\``,
            color: embedColor,
            timestamp: new Date().toISOString()
        };

        try {
            await fetch(this.config.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'aiko.logger', embeds: [embed] })
            });
        } catch (err) {}
    }

    _print(labelKey, terminalColor, rawMessage, embedColor, sendToWebhook = false) {
        if (!this._shouldLog(labelKey)) return;

        const formattedMessage = formatMessage(rawMessage);
        const cleanMessage = stripColors(formattedMessage);
        const typeLabel = this.t.labels[labelKey];
        
        const typeDisplay = terminalColor === colors.bgRed 
            ? `${colors.bgRed}${colors.white}[${typeLabel}]${colors.reset}` 
            : `${terminalColor}[${typeLabel}]${colors.reset}`;
        const prefixStr = this.config.prefix ? `${colors.gray}[${this.config.prefix}]${colors.reset} ` : '';
        
        console.log(`${colors.gray}[${getTimestamp(this.t.dateLocale)}]${colors.reset} ${prefixStr}${typeDisplay} ${formattedMessage}`);

        this._writeToFile(labelKey, cleanMessage);
        if (sendToWebhook) this._sendToWebhook(labelKey, cleanMessage, embedColor);

        if (this.transports.length > 0) {
            const transportData = {
                level: labelKey,
                label: typeLabel,
                message: cleanMessage,
                timestamp: new Date().toISOString(),
                prefix: this.config.prefix 
            };
            setImmediate(() => {
                this.transports.forEach(transport => transport(transportData));
            });
        }
    }
    
    close() {
        for (const fileName in this.streams) {
            this.streams[fileName].end();
            delete this.streams[fileName];
        }
    }

    info(message)   { this._print('info', colors.cyan, message, 3447003, false); }
    success(message){ this._print('success', colors.green, message, 3066993, false); }
    debug(message)  { this._print('debug', colors.magenta, message, null, false); }
    warn(message)   { this._print('warn', colors.yellow, message, 16776960, true); }
    error(message)  { this._print('error', colors.red, message, 15158332, true); }
    fatal(message)  { this._print('fatal', colors.bgRed, message, 16711680, true); }
    logerr(message) { this._print('logerr', colors.dark_blue, message, 15158332, true); }
}

module.exports = { Logger };