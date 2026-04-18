const fs = require('fs');
const fsp = require('fs').promises; 
const path = require('path');
const { colors } = require('./colors/color');
const { locales } = require('./locales/locales');
const { detectLanguage, getTimestamp, stripColors, formatMessage } = require('./utils/helpers');

const LEVEL_HIERARCHY = { debug: 1, info: 2, success: 3, warn: 4, error: 5, logerr: 5, fatal: 6 };

class Logger {
    constructor(options = {}) {
        this.config = {
            saveToFile: options.saveToFile || false,
            logFolder: options.logFolder || './logs',
            webhookUrl: options.webhookUrl || null,
            keepLogsFor: options.keepLogsFor || 0, 
            autoCleanup: options.autoCleanup || false,
            minLevel: options.minLevel || 'debug', 
            format: options.format || 'text'       
        };

        this.lang = detectLanguage(options.language, locales);
        this.t = locales[this.lang];
    
        this.transports = [];

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

    async _writeToFile(labelKey, cleanMessage) {
        if (!this.config.saveToFile) return;

        try {
            if (!fs.existsSync(this.config.logFolder)) {
                await fsp.mkdir(this.config.logFolder, { recursive: true });
            }
            
            const dateStr = new Date().toLocaleDateString('tr-TR').replace(/\./g, '-');
            const typeLabel = this.t.labels[labelKey];
            const fileExt = this.config.format === 'json' ? 'json' : 'log';
            const filePath = path.join(this.config.logFolder, `${typeLabel}-${dateStr}.${fileExt}`);

            let logLine;
            if (this.config.format === 'json') {
                logLine = JSON.stringify({
                    timestamp: new Date().toISOString(),
                    level: typeLabel,
                    message: cleanMessage
                }) + '\n';
            } else {

                logLine = `[${getTimestamp(this.t.dateLocale)}] [${typeLabel}] ${cleanMessage}\n`;
            }

            await fsp.appendFile(filePath, logLine, 'utf8');
        } catch (err) {
            console.log(`${colors.red}[LOGGER ERROR]${colors.reset} ${this.t.messages.fileError}: ${err.message}`);
        }
    }

    async _cleanupLogs() {
        try {
            if (!fs.existsSync(this.config.logFolder)) return;

            const files = await fsp.readdir(this.config.logFolder);
            const now = Date.now();
            const msInDay = 24 * 60 * 60 * 1000;

            for (const file of files) {
                const filePath = path.join(this.config.logFolder, file);
                const stats = await fsp.stat(filePath);
                const ageInDays = (now - stats.mtimeMs) / msInDay;

                if (ageInDays > this.config.keepLogsFor) {
                    await fsp.unlink(filePath);
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

        const embed = {
            title: `🚨 ${typeLabel}`,
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

    async _print(labelKey, terminalColor, rawMessage, embedColor, sendToWebhook = false) {
        if (!this._shouldLog(labelKey)) return;

        const formattedMessage = formatMessage(rawMessage);
        const cleanMessage = stripColors(formattedMessage);
        
        const typeLabel = this.t.labels[labelKey];
        const typeDisplay = terminalColor === colors.bgRed 
            ? `${colors.bgRed}${colors.white}[${typeLabel}]${colors.reset}` 
            : `${terminalColor}[${typeLabel}]${colors.reset}`;

        console.log(`${colors.gray}[${getTimestamp(this.t.dateLocale)}]${colors.reset} ${typeDisplay} ${formattedMessage}`);
        
        this._writeToFile(labelKey, cleanMessage);
        if (sendToWebhook) this._sendToWebhook(labelKey, cleanMessage, embedColor);

        if (this.transports.length > 0) {
            const transportData = {
                level: labelKey,
                label: typeLabel,
                message: cleanMessage,
                timestamp: new Date().toISOString()
            };
            this.transports.forEach(transport => transport(transportData));
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