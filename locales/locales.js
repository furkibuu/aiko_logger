'use strict';

const locales = {
    tr: {
        labels: {
            info: 'BİLGİ',
            success: 'BAŞARI',
            warn: 'UYARI',
            error: 'HATA',
            debug: 'AYIKLAMA',
            fatal: 'KRİTİK',
            logerr: 'SİS. HATA'
        },
        messages: {
            fileError: 'Log dosyasına yazılamadı',
            folderError: 'Log klasörü oluşturulamadı, dosyaya yazma devre dışı',
            webhookError: 'Webhook gönderilemedi',
            webhookRejected: 'Webhook reddedildi',
            logDetail: 'Log Detayı',
            cleanupSuccess: 'Eski log dosyası temizlendi',
            cleanupError: 'Log temizlik hatası',
            transportInvalid: 'Transport bir fonksiyon olmalı.',
            transportError: 'Transport hatası',
            invalidLevel: "Geçersiz log seviyesi: '{value}'. Varsayılan değer kullanılacak.",
            invalidFormat: "Geçersiz format: '{value}'. Varsayılan olarak 'text' kullanılacak.",
            invalidWebhook: "Geçersiz webhook URL'si: webhook devre dışı bırakıldı."
        },
        dateLocale: 'tr-TR'
    },
    en: {
        labels: {
            info: 'INFO',
            success: 'SUCCESS',
            warn: 'WARN',
            error: 'ERROR',
            debug: 'DEBUG',
            fatal: 'FATAL',
            logerr: 'SYS ERR'
        },
        messages: {
            fileError: 'Failed to write to log file',
            folderError: 'Could not create log folder, file logging disabled',
            webhookError: 'Failed to send webhook',
            webhookRejected: 'Webhook request rejected',
            logDetail: 'Log Details',
            cleanupSuccess: 'Old log file cleaned up',
            cleanupError: 'Log cleanup error',
            transportInvalid: 'Transport must be a function.',
            transportError: 'Transport error',
            invalidLevel: "Invalid log level: '{value}'. Falling back to the default.",
            invalidFormat: "Invalid format: '{value}'. Defaulting to 'text'.",
            invalidWebhook: 'Invalid webhook URL: webhook disabled.'
        },
        dateLocale: 'en-US'
    }
};

module.exports = { locales };
