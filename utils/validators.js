'use strict';

const { colors, noColors, shouldUseColors } = require('../colors/colors');
const { fillTemplate } = require('./helpers');

function warn(message) {
    const c = shouldUseColors() ? colors : noColors;
    console.log(`${c.yellow}[LOGGER WARN]${c.reset} ${message}`);
}

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const validateLevel = (level, hierarchy, t) => {
    if (level === undefined || level === null) return true;
    if (!has(hierarchy, level)) {
        warn(fillTemplate(t.messages.invalidLevel, { value: level }));
        return false;
    }
    return true;
};

const validateLanguage = (lang, locales) => {
    if (lang && !has(locales, lang)) {
        warn(`Desteklenmeyen dil / Unsupported language: '${lang}'. Defaulting to auto-detect/en.`);
        return false;
    }
    return true;
};

const validateFormat = (format, t) => {
    if (format === undefined || format === null) return true;
    if (format !== 'text' && format !== 'json') {
        warn(fillTemplate(t.messages.invalidFormat, { value: format }));
        return false;
    }
    return true;
};

const validateWebhookUrl = (url, t) => {
    if (url === undefined || url === null || url === '') return true;
    try {
        const parsed = new URL(url);
        if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return true;
    } catch (err) { }
    warn(t.messages.invalidWebhook);
    return false;
};

module.exports = { validateLevel, validateLanguage, validateFormat, validateWebhookUrl };
