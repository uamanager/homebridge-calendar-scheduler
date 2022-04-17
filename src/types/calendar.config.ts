import { CalendarEventConfig, ICalendarEventConfig } from './event.config';

export interface ICalendarConfig {
  calendarName: string;
  calendarUrl: string;
  calendarUpdateInterval?: number;
  calendarEvents?: ICalendarEventConfig[];
}

export class CalendarConfig implements ICalendarConfig {
  readonly calendarName: string;
  readonly calendarUrl: string;
  readonly calendarUpdateInterval?: number;
  readonly calendarEvents: CalendarEventConfig[];

  get id (): string {
    return `${this.calendarName}`;
  }

  constructor (calendar: ICalendarConfig) {
    this.calendarName = calendar.calendarName;
    this.calendarUrl = calendar.calendarUrl;
    this.calendarUpdateInterval = calendar.calendarUpdateInterval || 60;
    this.calendarEvents = (calendar.calendarEvents || []).map((event) => {
      return new CalendarEventConfig(calendar, event);
    });
  }
}
