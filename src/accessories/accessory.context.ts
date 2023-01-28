import { CalendarConfig } from '../configs/calendar.config';
import { CalendarEventConfig } from '../configs/event.config';
import { IBaseAccessoryContext } from 'homebridge-util-accessory-manager';
import { CalendarEventNotificationConfig } from '../configs/notification.config';

export interface IAccessoryContext extends IBaseAccessoryContext {
  calendarConfig: CalendarConfig;
  calendarEventConfig?: CalendarEventConfig;
  calendarEventNotificationConfig?: CalendarEventNotificationConfig;
}
