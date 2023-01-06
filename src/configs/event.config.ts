import { ICalendarConfig } from './calendar.config';
import { IConfig } from './config';

export interface ICalendarEventConfig {
  calendarName: string;
  eventName: string;
  eventTriggerOnUpdates?: boolean;
  caseInsensitiveEventsMatching?: boolean;
}

export class CalendarEventConfig implements ICalendarEventConfig {
  readonly calendarName: string;
  readonly eventName: string;
  readonly eventTriggerOnUpdates?: boolean;
  readonly caseInsensitiveEventsMatching?: boolean;

  constructor(_config: IConfig, _calendar: ICalendarConfig, event: ICalendarEventConfig) {
    this.eventName = event.eventName;
    this.calendarName = _calendar.calendarName;
    this.eventTriggerOnUpdates = event.eventTriggerOnUpdates || false;
    this.caseInsensitiveEventsMatching = event.eventTriggerOnUpdates || _calendar.caseInsensitiveEventsMatching || _config.caseInsensitiveEventsMatching || false;
  }

  get id(): string {
    return `${this.calendarName}-${this.eventName}`;
  }
}
