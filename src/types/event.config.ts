import { ICalendarConfig } from './calendar.config';

export interface ICalendarEventConfig {
  eventName: string;
}

export class CalendarEventConfig implements ICalendarEventConfig {
  readonly eventName: string;

  get id (): string {
    return `${this._calendar.calendarName}-${this.eventName}`;
  }

  constructor (private _calendar: ICalendarConfig, event: ICalendarEventConfig) {
    this.eventName = event.eventName;
  }
}
