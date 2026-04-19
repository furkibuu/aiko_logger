export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error' | 'fatal' | 'logerr';
export type LogFormat = 'text' | 'json';
export type Language = 'tr' | 'en';

export interface LoggerOptions {
    saveToFile?: boolean;
    logFolder?: string;
    webhookUrl?: string | null;
    keepLogsFor?: number;
    autoCleanup?: boolean;
    minLevel?: LogLevel;
    format?: LogFormat;
    language?: Language;
    prefix?: string; 
}

export interface TransportData {
    level: LogLevel;
    label: string;
    message: string;
    timestamp: string;
    prefix?: string;
}

export type TransportFunction = (data: TransportData) => void;

export class Logger {
    constructor(options?: LoggerOptions);
    addTransport(transportFunc: TransportFunction): void;
    info(message: any): void;
    success(message: any): void;
    debug(message: any): void;
    warn(message: any): void;
    error(message: any): void;
    fatal(message: any): void;
    logerr(message: any): void;
}