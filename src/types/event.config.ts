import { ICalendarConfig } from './calendar.config';

export interface ICalendarEventConfig {
  eventName: string;
  eventTriggerOnUpdates: boolean;
}

export class CalendarEventConfig implements ICalendarEventConfig {
  readonly eventName: string;
  readonly eventTriggerOnUpdates: boolean;

  get id (): string {
    return `${this._calendar.calendarName}-${this.eventName}`;
  }

  constructor (private _calendar: ICalendarConfig, event: ICalendarEventConfig) {
    this.eventName = event.eventName;
    this.eventTriggerOnUpdates = event.eventTriggerOnUpdates || false;
  }
}
