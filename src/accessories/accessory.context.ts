import { ICalendarConfig } from '../configs/calendar.config';
import { ICalendarEvent } from '../calendar';
import { ICalendarEventConfig } from '../configs/event.config';

export interface IAccessoryContext {
  manufacturer: string;
  model: string;
  name: string;
  serialNumber: string;
  version: string;
  calendarConfig: ICalendarConfig;
  calendarEventConfig?: ICalendarEventConfig;
}
