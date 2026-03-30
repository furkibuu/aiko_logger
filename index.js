const fs = require('fs');
const path = require('path');
const util = require('util');
const { colors } = require('./colors/color');
const { locales } = require('./locales/locales');

class Logger {
    constructor(options = {}) {
        this.config = {
            saveToFile: options.saveToFile || false,
            logFolder: options.logFolder || './logs',
            webhookUrl: options.webhookUrl || null
        };
    
        this.lang = this._detectLanguage(options.language);
        this.t = locales[this.lang]; 
    }

    _detectLanguage(customLang) {
        if (customLang && locales[customLang]) return customLang;

        try {
            const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale || '';
            const envLang = process.env.LANG || process.env.LC_ALL || '';

            if (systemLocale.toLowerCase().startsWith('tr') || envLang.toLowerCase().startsWith('tr')) {
                return 'tr';
            }
        } catch (err) {
        }
        return 'en';
    }

    _getTimestamp() {
        const now = new Date();
        const locale = this.t.dateLocale;
        const date = now.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
        const time = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return `${date} - ${time}`;
    }

    _stripColors(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/\x1b\[[0-9;]*m/g, '');
    }

    _formatMessage(message) {
        if (message instanceof Error) return message.stack || message.message;
        if (typeof message === 'object' && message !== null) return util.inspect(message, { depth: null, colors: false });
        return String(message);
    }


    _writeToFile(labelKey, cleanMessage) {
        if (!this.config.saveToFile) return;

        try {
            if (!fs.existsSync(this.config.logFolder)) {
                fs.mkdirSync(this.config.logFolder, { recursive: true });
            }
            
            const dateStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '-');
            const typeLabel = this.t.labels[labelKey];
            const fileName = `${typeLabel}-${dateStr}.log`;
            const filePath = path.join(this.config.logFolder, fileName);

            const timestamp = this._getTimestamp();
            const logLine = `[${timestamp}] [${typeLabel}] ${cleanMessage}\n`;

            fs.appendFileSync(filePath, logLine, 'utf8');
        } catch (err) {
            console.log(`${colors.red}[LOGGER SYSTEM ERROR]${colors.reset} ${this.t.messages.fileError}: ${err.message}`);
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
            const response = await fetch(this.config.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'aiko.logger', embeds: [embed] })
            });

            if (!response.ok) {
                console.log(`${colors.red}[LOGGER SYSTEM ERROR]${colors.reset} ${this.t.messages.webhookRejected} (Status: ${response.status})`);
            }
        } catch (err) {
            console.log(`${colors.red}[LOGGER SYSTEM ERROR]${colors.reset} ${this.t.messages.webhookError}: ${err.message}`);
        }
    }

    _print(labelKey, terminalColor, rawMessage, embedColor, sendToWebhook = false) {
        const formattedMessage = this._formatMessage(rawMessage);
        const cleanMessage = this._stripColors(formattedMessage);
        
        const timestamp = this._getTimestamp();
        const typeLabel = this.t.labels[labelKey];
        
        const typeDisplay = terminalColor === colors.bgRed 
            ? `${colors.bgRed}${colors.white}[${typeLabel}]${colors.reset}` 
            : `${terminalColor}[${typeLabel}]${colors.reset}`;

        console.log(`${colors.gray}[${timestamp}]${colors.reset} ${typeDisplay} ${formattedMessage}`);
        
        this._writeToFile(labelKey, cleanMessage);
        if (sendToWebhook) this._sendToWebhook(labelKey, cleanMessage, embedColor);
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