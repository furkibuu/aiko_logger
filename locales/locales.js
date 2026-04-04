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
            webhookError: 'Webhook gönderilemedi',
            webhookRejected: 'Webhook reddedildi',
            logDetail: 'Log Detayı',
            cleanupSuccess: 'Eski log dosyası temizlendi',
            cleanupError: 'Log temizlik hatası'
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
            webhookError: 'Failed to send webhook',
            webhookRejected: 'Webhook request rejected',
            logDetail: 'Log Details',
            cleanupSuccess: 'Old log file cleaned up',
            cleanupError: 'Log cleanup error'
        },
        dateLocale: 'en-US'
    }
};

module.exports = { locales };