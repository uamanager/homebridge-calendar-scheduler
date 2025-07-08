import { Logger, LogLevel } from 'homebridge';

export class CSLogger implements Logger {
  constructor(
    protected readonly $_logger: Logger,
    protected readonly _debugEnabled: boolean = false,
  ) {
  }

  info(message: string, ...parameters: unknown[]) {
    this.$_logger.info(message, ...parameters);
  }

  warn(message: string, ...parameters: unknown[]) {
    this.$_logger.warn(message, ...parameters);
  }

  error(message: string, ...parameters: unknown[]) {
    this.$_logger.error(message, ...parameters);
  }

  success(message: string, ...parameters: unknown[]) {
    this.$_logger.success(message, ...parameters);
  }

  debug(message: string, ...parameters: unknown[]) {
    if (this._debugEnabled) {
      this.$_logger.info(message, ...parameters);
    }
  }

  log(level: LogLevel, message: string, ...parameters: unknown[]): void {
    this.$_logger.log(level, message, ...parameters);
  }
}
