const fs = require('fs');
const path = require('path');
const util = require('util');
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m",
    bgRed: "\x1b[41m", 
    white: "\x1b[37m"
};


const locales = {
    tr: {
        labels: { info: 'BİLGİ', success: 'BAŞARI', warn: 'UYARI', error: 'HATA', debug: 'AYIKLAMA', fatal: 'KRİTİK' },
        messages: {
            fileError: 'Log dosyasına yazılamadı',
            webhookError: 'Webhook gönderilemedi',
            webhookRejected: 'Webhook reddedildi',
            logDetail: 'Log Detayı'
        },
        dateLocale: 'tr-TR'
    },
    en: {
        labels: { info: 'INFO', success: 'SUCCESS', warn: 'WARN', error: 'ERROR', debug: 'DEBUG', fatal: 'FATAL' },
        messages: {
            fileError: 'Failed to write to log file',
            webhookError: 'Failed to send webhook',
            webhookRejected: 'Webhook request rejected',
            logDetail: 'Log Details'
        },
        dateLocale: 'en-US'
    }
};

class Logger {
    constructor(options = {}) {
        this.saveToFile = options.saveToFile || false;
        this.logFolder = options.logFolder || './logs';
        this.webhookUrl = options.webhookUrl || null;
        let detectedLang = 'en'; 

        if (options.language) {
            detectedLang = options.language === 'tr' ? 'tr' : 'en';
        } else {
            try {
                const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale || '';
                const envLang = process.env.LANG || process.env.LC_ALL || '';

                if (systemLocale.toLowerCase().startsWith('tr') || envLang.toLowerCase().startsWith('tr')) {
                    detectedLang = 'tr';
                }
            } catch (err) {

            }
        }

        this.lang = detectedLang; 
        this.t = locales[this.lang]; 
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
        if (message instanceof Error) {
            return message.stack || message.message;
        } else if (typeof message === 'object' && message !== null) {
            return util.inspect(message, { depth: null, colors: false });
        }
        return String(message);
    }

    _writeToFile(labelKey, cleanMessage) {
        if (!this.saveToFile) return;

        try {
            if (!fs.existsSync(this.logFolder)) {
                fs.mkdirSync(this.logFolder, { recursive: true });
            }
            
            const now = new Date();
            const dateStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '-');
            const typeLabel = this.t.labels[labelKey];
            const fileName = `${typeLabel}-${dateStr}.log`;
            const filePath = path.join(this.logFolder, fileName);

            const timestamp = this._getTimestamp();
            const logLine = `[${timestamp}] [${typeLabel}] ${cleanMessage}\n`;

            fs.appendFileSync(filePath, logLine, 'utf8');
        } catch (err) {
            console.log(`${colors.red}[LOGGER SYSTEM ERROR]${colors.reset} ${this.t.messages.fileError}: ${err.message}`);
        }
    }

    async _sendToWebhook(labelKey, cleanMessage, embedColor) {
        if (!this.webhookUrl) return;

        let safeMessage = cleanMessage;
        if (safeMessage.length > 4000) {
            safeMessage = safeMessage.substring(0, 3995) + '...';
        }

        const typeLabel = this.t.labels[labelKey];
        const embed = {
            title: `🚨 ${typeLabel}`,
            description: `**${this.t.messages.logDetail}:**\n\`\`\`${safeMessage}\`\`\``,
            color: embedColor,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'aiko.logger',
                    embeds: [embed]
                })
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
        if (sendToWebhook) {
            this._sendToWebhook(labelKey, cleanMessage, embedColor);
        }
    }

 
    info(message) { 
        this._print('info', colors.cyan, message, 3447003, false); 
    }    
 
    success(message) { 
        this._print('success', colors.green, message, 3066993, false); 
    } 

    debug(message) { 
        this._print('debug', colors.magenta, message, null, false); 
    }
    warn(message) { 
        this._print('warn', colors.yellow, message, 16776960, true); 
    }   
    error(message) { 
        this._print('error', colors.red, message, 15158332, true); 
    } 
    fatal(message) { 
        this._print('fatal', colors.bgRed, message, 16711680, true); 
    }
}

module.exports = { Logger };