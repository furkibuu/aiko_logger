const { colors } = require('../colors/colors');

const validateLevel = (level, hierarchy, t = null) => {
    if (level && !hierarchy.hasOwnProperty(level)) {
        const warnMsg = t && t.dateLocale === 'tr-TR'  ? `Geçersiz log seviyesi: '${level}'. Varsayılan olarak 'debug' kullanılacak.`: `Invalid log level: '${level}'. Defaulting to 'debug'.`;   
        console.log(`${colors.yellow}[LOGGER WARN]${colors.reset} ${warnMsg}`);
        return false;
    }
    return true;
};

const validateLanguage = (lang, locales) => {
    if (lang && !locales.hasOwnProperty(lang)) {

        console.log(`${colors.yellow}[LOGGER WARN]${colors.reset} Desteklenmeyen dil / Unsupported language: '${lang}'. Defaulting to auto-detect/en.`);
        return false;
    }
    return true;
};

module.exports = { validateLevel, validateLanguage };