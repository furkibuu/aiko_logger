const util = require('util');
function detectLanguage(customLang, locales) {
    if (customLang && locales[customLang]) return customLang;
    try {
        const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale || '';
        const envLang = process.env.LANG || process.env.LC_ALL || '';
        if (systemLocale.toLowerCase().startsWith('tr') || envLang.toLowerCase().startsWith('tr')) return 'tr';
    } catch (err) {}
    return 'en';
}

function getTimestamp(dateLocale) {
    const now = new Date();
    return `${now.toLocaleDateString(dateLocale)} - ${now.toLocaleTimeString(dateLocale)}`;
}

function stripColors(str) {
    return typeof str === 'string' ? str.replace(/\x1b\[[0-9;]*m/g, '') : str;
}

function formatMessage(message) {
    if (message instanceof Error) return message.stack || message.message;
    if (typeof message === 'object' && message !== null) return util.inspect(message, { depth: null, colors: false });
    return String(message);
}

module.exports = {
    detectLanguage,
    getTimestamp,
    stripColors,
    formatMessage
};