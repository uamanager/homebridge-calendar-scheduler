import { CalendarConfig } from './calendar.config';
import { Config } from './config';

export interface ICalendarEventConfig {
  calendarName: string;
  eventName: string;
  eventTriggerOnUpdates?: boolean;
  caseInsensitiveEventsMatching?: boolean;
}

export class CalendarEventConfig implements ICalendarEventConfig {
  readonly calendarName: string;
  readonly eventName: string;
  readonly eventTriggerOnUpdates: boolean;
  readonly caseInsensitiveEventsMatching: boolean;
  readonly eventMatcher: RegExp;
  readonly safeEventName: string;

  constructor(_config: Config, _calendar: CalendarConfig, event: ICalendarEventConfig) {
    this.eventName = event.eventName;
    this.calendarName = _calendar.calendarName;
    this.eventTriggerOnUpdates = event.eventTriggerOnUpdates || false;
    this.caseInsensitiveEventsMatching = event.caseInsensitiveEventsMatching || _calendar.caseInsensitiveEventsMatching || _config.caseInsensitiveEventsMatching || false;
    this.eventMatcher = new RegExp(this.eventName, this.caseInsensitiveEventsMatching ? 'i' : '');
    this.safeEventName = this.eventName.replace(/\W/gi, '_');
  }

  get id(): string {
    return `${this.calendarName}-${this.eventName}`;
  }
}
