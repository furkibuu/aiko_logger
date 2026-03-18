const fs = require('fs');
const path = require('path');
const util = require('util'); 

const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m"
};

class Logger {
    constructor(options = {}) {
        this.saveToFile = options.saveToFile || false;
        this.logFolder = options.logFolder || './logs';
        this.webhookUrl = options.webhookUrl || null;
    }

    _getTimestamp() {
        const now = new Date();
        const date = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const time = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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

    _writeToFile(type, cleanMessage) {
        if (!this.saveToFile) return;

        try {
            if (!fs.existsSync(this.logFolder)) {
                fs.mkdirSync(this.logFolder, { recursive: true });
            }
            const now = new Date();
            const dateStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '-');
            const fileName = `${type}-${dateStr}.log`;
            const filePath = path.join(this.logFolder, fileName);

            const timestamp = this._getTimestamp();
            const logLine = `[${timestamp}] [${type}] ${cleanMessage}\n`;

            fs.appendFileSync(filePath, logLine, 'utf8');
        } catch (err) {
            console.log(`${colors.red}[LOGGER SİSTEM HATASI]${colors.reset} Log dosyasına yazılamadı: ${err.message}`);
        }
    }

    async _sendToWebhook(type, cleanMessage, embedColor) {
        if (!this.webhookUrl) return;
        let safeMessage = cleanMessage;
        if (safeMessage.length > 4000) {
            safeMessage = safeMessage.substring(0, 3995) + '...';
        }

        const embed = {
            title: `${type} Bildirimi`,
            description: `**Log Detayı:**\n\`\`\`${safeMessage}\`\`\``,
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
                console.log(`${colors.red}[SİSTEM HATASI]${colors.reset} Webhook reddedildi. Status: ${response.status}`);
            }
        } catch (err) {
            console.log(`${colors.red}[SİSTEM HATASI]${colors.reset} Webhook gönderilemedi: ${err.message}`);
        }
    }

    _print(type, terminalColor, rawMessage, embedColor) {
        const formattedMessage = this._formatMessage(rawMessage);
        const cleanMessage = this._stripColors(formattedMessage);
        const timestamp = this._getTimestamp();
        console.log(`${colors.gray}[${timestamp}]${colors.reset} ${terminalColor}[${type}]${colors.reset} ${formattedMessage}`);
        this._writeToFile(type, cleanMessage);

        if (type === 'HATA' || type === 'UYARI') {
            this._sendToWebhook(type, cleanMessage, embedColor);
        }
    }

    info(message) { this._print('BİLGİ', colors.cyan, message, 3447003); }    
    success(message) { this._print('BAŞARI', colors.green, message, 3066993); } 
    warn(message) { this._print('UYARI', colors.yellow, message, 16776960); }   
    error(message) { this._print('HATA', colors.red, message, 15158332); }     
}

module.exports = { Logger };