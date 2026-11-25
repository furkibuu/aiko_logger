export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error' | 'fatal' | 'logerr';
export type LogFormat = 'text' | 'json';
export type Language = 'tr' | 'en';

export interface LoggerOptions {
  
    saveToFile?: boolean;
   
    logFolder?: string;
  
    webhookUrl?: string | null;

    webhookMinLevel?: LogLevel;
  
    keepLogsFor?: number;
 
    autoCleanup?: boolean;
  
    minLevel?: LogLevel;
  
    format?: LogFormat;
   
    language?: Language;
  
    prefix?: string;
 
    silent?: boolean;

    colors?: boolean | 'auto';
}

export interface TransportData {
    level: LogLevel;
    label: string;
    message: string;
    timestamp: string;
    prefix?: string | null;
}

export type TransportFunction = (data: TransportData) => void;

export class Logger {
    constructor(options?: LoggerOptions);
    readonly lang: Language;
    addTransport(transportFunc: TransportFunction): void;
    
    child(prefix: string): Logger;
   
    close(): Promise<void>;
    info(...args: any[]): void;
    success(...args: any[]): void;
    debug(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    fatal(...args: any[]): void;
    logerr(...args: any[]): void;
}
