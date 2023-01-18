import { CalendarConfig } from '../configs/calendar.config';
import { CalendarEventConfig } from '../configs/event.config';

export interface IAccessoryContext {
  manufacturer: string;
  model: string;
  name: string;
  serialNumber: string;
  version: string;
  calendarConfig: CalendarConfig;
  calendarEventConfig?: CalendarEventConfig;
}
