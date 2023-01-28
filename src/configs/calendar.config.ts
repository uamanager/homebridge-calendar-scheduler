import { CalendarEventConfig, ICalendarEventConfig } from './event.config';
import { Config } from './config';

export interface ICalendarConfig {
  calendarName: string;
  calendarUrl: string;
  calendarUpdateInterval?: number;
  calendarUpdateButton?: boolean;
  calendarTriggerOnUpdates?: boolean;
  calendarTriggerOnAllEvents?: boolean;
  caseInsensitiveEventsMatching?: boolean;
  calendarEvents?: ICalendarEventConfig[];
}

export class CalendarConfig implements ICalendarConfig {
  readonly calendarName: string;
  readonly calendarUrl: string;
  readonly calendarUpdateInterval: number;
  readonly calendarUpdateIntervalMillis: number;
  readonly calendarUpdateButton: boolean;
  readonly calendarTriggerOnUpdates: boolean;
  readonly calendarTriggerOnAllEvents: boolean;
  readonly caseInsensitiveEventsMatching: boolean;
  readonly calendarEvents: CalendarEventConfig[];

  constructor(_config: Config, calendar: ICalendarConfig) {
    this.calendarName = calendar.calendarName;
    this.calendarUrl = calendar.calendarUrl;
    this.calendarUpdateInterval = calendar.calendarUpdateInterval || 60;
    this.calendarUpdateIntervalMillis = this.calendarUpdateInterval * 60 * 1000;
    this.calendarUpdateButton = calendar.calendarUpdateButton || true;
    this.calendarTriggerOnUpdates = calendar.calendarTriggerOnUpdates || true;
    this.calendarTriggerOnAllEvents = calendar.calendarTriggerOnAllEvents || false;
    this.caseInsensitiveEventsMatching = calendar.caseInsensitiveEventsMatching
      || _config.caseInsensitiveEventsMatching || false;
    this.calendarEvents = (calendar.calendarEvents || [])
      .map((event) => {
        return new CalendarEventConfig(_config, this, event);
      });
  }

  get id(): string {
    return `${this.calendarName}`;
  }
}
