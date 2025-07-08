import { CalendarConfig } from './calendar.config.js';
import { Config } from './config.js';
import { CalendarEventNotificationConfig } from './notification.config.js';

export interface ICalendarEventConfig {
  calendarName: string;
  eventName: string;
  eventTriggerOnUpdates?: boolean;
  caseInsensitiveEventsMatching?: boolean;
  unsafeEventNames?: boolean;
  calendarEventNotifications?: CalendarEventNotificationConfig[];
}

export class CalendarEventConfig implements ICalendarEventConfig {
  readonly calendarName: string;
  readonly eventName: string;
  readonly eventTriggerOnUpdates: boolean;
  readonly caseInsensitiveEventsMatching: boolean;
  readonly unsafeEventNames: boolean;
  readonly eventMatcher: RegExp;
  readonly safeEventName: string;
  readonly calendarEventNotifications: CalendarEventNotificationConfig[] = [];

  constructor(_config: Config, _calendar: CalendarConfig, event: ICalendarEventConfig) {
    this.eventName = event.eventName;
    this.calendarName = _calendar.calendarName;
    this.eventTriggerOnUpdates = event.eventTriggerOnUpdates || false;
    this.caseInsensitiveEventsMatching = event.caseInsensitiveEventsMatching
      || _calendar.caseInsensitiveEventsMatching
      || _config.caseInsensitiveEventsMatching || false;
    this.unsafeEventNames = event.unsafeEventNames
      || _calendar.unsafeEventNames
      || _config.unsafeEventNames || false;
    this.eventMatcher = new RegExp(
      this.eventName,
      this.caseInsensitiveEventsMatching ? 'i' : '',
    );
    this.safeEventName = this.unsafeEventNames
      ? this.eventName
      : this.eventName
        .replace(/\W/gi, ' ')
        .trim()
        .replace(/\s+/g, ' ');
    this.calendarEventNotifications = (event.calendarEventNotifications || [])
      .map((notification) => {
        return new CalendarEventNotificationConfig(_config, _calendar, this, notification);
      })
      .filter((notification) => {
        return notification.notificationEndOffsetMillis
          || notification.notificationStartOffsetMillis;
      });
  }

  get id(): string {
    return `${this.calendarName}-${this.eventName}`;
  }
}
