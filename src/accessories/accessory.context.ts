import { CalendarConfig } from '../configs/calendar.config';
import { CalendarEventConfig } from '../configs/event.config';
import { IBaseAccessoryContext } from 'homebridge-util-accessory-manager';

export interface IAccessoryContext extends IBaseAccessoryContext {
  calendarConfig: CalendarConfig;
  calendarEventConfig?: CalendarEventConfig;
}
