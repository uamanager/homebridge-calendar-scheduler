import { CalendarConfig } from '../configs/calendar.config.js';
import { CalendarEventConfig } from '../configs/event.config.js';
import { IBaseAccessoryContext } from 'homebridge-util-accessory-manager';
import { CalendarEventNotificationConfig } from '../configs/notification.config.js';

export interface IAccessoryContext extends IBaseAccessoryContext {
  calendarConfig: CalendarConfig;
  calendarEventConfig?: CalendarEventConfig;
  calendarEventNotificationConfig?: CalendarEventNotificationConfig;
}
