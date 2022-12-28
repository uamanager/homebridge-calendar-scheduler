import { ICalendarConfig } from './calendar.config';
import { IConfig } from './config';

export interface ICalendarEventConfig {
  eventName: string;
  eventTriggerOnUpdates?: boolean;
  caseInsensitiveEventsMatching?: boolean;
}

export class CalendarEventConfig implements ICalendarEventConfig {
  readonly eventName: string;
  readonly eventTriggerOnUpdates?: boolean;
  readonly caseInsensitiveEventsMatching?: boolean;

  constructor(private _config: IConfig, private _calendar: ICalendarConfig, event: ICalendarEventConfig) {
    this.eventName = event.eventName;
    this.eventTriggerOnUpdates = event.eventTriggerOnUpdates || false;
    this.caseInsensitiveEventsMatching = event.eventTriggerOnUpdates || _calendar.caseInsensitiveEventsMatching || this._config.caseInsensitiveEventsMatching || false;
  }

  get id(): string {
    return `${this._calendar.calendarName}-${this.eventName}`;
  }
}
