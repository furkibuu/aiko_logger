'use strict';

const util = require('util');

function detectLanguage(customLang, locales) {
    if (customLang && Object.prototype.hasOwnProperty.call(locales, customLang)) return customLang;
    try {
        const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale || '';
        const envLang = process.env.LC_ALL || process.env.LANG || process.env.LANGUAGE || '';
        if (systemLocale.toLowerCase().startsWith('tr') || envLang.toLowerCase().startsWith('tr')) return 'tr';
    } catch (err) {  }
    return 'en';
}

const pad = (n) => String(n).padStart(2, '0');

function getTimestamp(dateLocale) {
    const now = new Date();
    return `${now.toLocaleDateString(dateLocale)} - ${now.toLocaleTimeString(dateLocale)}`;
}


function getDateStamp(date = new Date()) {
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

function stripColors(str) {
    return typeof str === 'string' ? str.replace(/\x1b\[[0-9;]*m/g, '') : str;
}

function formatMessage(message) {
    if (message instanceof Error) return message.stack || message.message;
    if (typeof message === 'object' && message !== null) {
        return util.inspect(message, { depth: null, colors: false });
    }
    return String(message);
}


function formatArgs(args) {
    return args.map(formatMessage).join(' ');
}

function truncate(str, max) {
    return str.length > max ? str.substring(0, max - 3) + '...' : str;
}


function escapeCodeBlock(str) {
    return str.replace(/```/g, '`\u200b``');
}

function fillTemplate(template, vars) {
    return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
    detectLanguage,
    getTimestamp,
    getDateStamp,
    stripColors,
    formatMessage,
    formatArgs,
    truncate,
    escapeCodeBlock,
    fillTemplate,
    sleep
};
