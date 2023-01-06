import { ICalendarConfig } from '../configs/calendar.config';

export interface IAccessoryContext {
  manufacturer: string;
  model: string;
  name: string;
  serialNumber: string;
  version: string;
  config: ICalendarConfig;
}
