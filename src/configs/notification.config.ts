import { ICalendarConfig } from './calendar.config';
import { IConfig } from './config';
import { ICalendarEventConfig } from './event.config';

export interface ICalendarEventNotificationConfig {
  notificationName: string;
  notificationEndOffset?: number | undefined;
  notificationStartOffset?: number | undefined;
}

export class CalendarEventNotificationConfig implements ICalendarEventNotificationConfig {
  readonly calendarName: string;
  readonly eventName: string;
  readonly notificationName: string;
  readonly notificationStartOffset?: number | undefined;
  readonly notificationStartOffsetMillis?: number | undefined;
  readonly notificationEndOffset?: number | undefined;
  readonly notificationEndOffsetMillis?: number | undefined;

  constructor(
    _config: IConfig,
    _calendar: ICalendarConfig,
    _event: ICalendarEventConfig,
    notification: ICalendarEventNotificationConfig,
  ) {
    this.eventName = _event.eventName;
    this.calendarName = _calendar.calendarName;
    this.notificationName = notification.notificationName;
    this.notificationStartOffset = this._mapToRange(notification.notificationStartOffset);
    if (!this.notificationStartOffset) {
      this.notificationEndOffset = this._mapToRange(notification.notificationEndOffset);

      if (this.notificationEndOffset) {
        this.notificationEndOffsetMillis = this.notificationEndOffset * 60 * 1000;
      }
    } else {
      this.notificationStartOffsetMillis = this.notificationStartOffset * 60 * 1000;
    }
  }

  get id(): string {
    return `${this.calendarName}-${this.eventName}-${this.notificationName}`;
  }

  protected _mapToRange(value?: number | undefined): number | undefined {
    if (!value) {
      return undefined;
    }
    if(value > 0){
      return Math.max(0, Math.min(60, value));
    } else {
      return Math.min(0, Math.max(-60, value));
    }
  }
}
