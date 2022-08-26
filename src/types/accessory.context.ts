import { CalendarConfig } from './calendar.config';

export interface IAccessoryContext {
  calendar: CalendarConfig;
  manufacturer: string;
  model: string;
  name: string;
  serialNumber: string;
  version: string;
}
