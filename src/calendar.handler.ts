import { CalendarAccessory } from './accessories/calendar.accessory';
import { EventAccessory } from './accessories/event.accessory';
import { Calendar, ICalendarEvent } from './calendar';
import { TPlatformAccessories } from './platform';
import { PLATFORM_MANUFACTURER, PLATFORM_VERSION } from './settings';
import { IAccessoryContext } from './accessories/accessory.context';
import { CalendarConfig } from './configs/calendar.config';
import { CalendarEventConfig } from './configs/event.config';
import { Job } from './job.manager';
import { API, Logger } from 'homebridge';
import { AccessoriesManager, IBaseAccessoryCtor } from 'homebridge-util-accessory-manager';
import { ToadScheduler } from 'toad-scheduler';
import { CalendarEventNotificationConfig } from './configs/notification.config';
import { NotificationAccessory } from './accessories/notification.accessory';

export class CalendarHandler {
  private _calendarFetchJob: Job;
  private _calendar: Calendar;

  constructor(
    private readonly $_api: API,
    private readonly calendarConfig: CalendarConfig,
    readonly $_accessoryManager: AccessoriesManager<TPlatformAccessories, IAccessoryContext>,
    private readonly $_scheduler: ToadScheduler,
    private readonly $_logger?: Logger,
  ) {
    this.$_logger && this.$_logger.debug(
      'Finished initializing calendar handler:',
      this.calendarConfig.calendarName,
    );

    this._calendarFetchJob = new Job(
      `calendar-fetch-${this.calendarConfig.calendarName}`,
      {
        milliseconds: this.calendarConfig.calendarUpdateIntervalMillis,
        runImmediately: true,
      },
      this._handleCalendarFetchJob.bind(this),
      this.$_scheduler,
    );

    this._calendar = new Calendar(
      this.calendarConfig.calendarName,
      this.calendarConfig.calendarUrl,
      this.$_logger,
    );

    this.init();
  }

  init() {
    this._initAccessories();

    this._calendarFetchJob.start();
  }

  tick() {
    this.$_logger && this.$_logger.debug(
      'Tick handled:',
      this.calendarConfig.calendarName,
    );

    const _now = this._calendar.now();

    const _activeEvents = this._calendar.getEvents(_now, _now);

    const _watchedActiveEvents = _activeEvents.filter((event) => {
      return this.calendarConfig.calendarEvents.findIndex((watchedEvent) => {
        return watchedEvent.eventMatcher.test(event.summary);
      }) !== -1;
    });

    this._calendarUpdateState(this.calendarConfig, _activeEvents, _watchedActiveEvents);

    this.calendarConfig.calendarEvents.forEach((eventConfig) => {
      this._calendarEventUpdateState(eventConfig, _watchedActiveEvents);

      eventConfig.calendarEventNotifications.forEach((eventNotificationConfig) => {
        this._calendarEventNotificationUpdateState(eventConfig, eventNotificationConfig);
      });
    });
  }

  private _initAccessories() {
    const _calendarContext = this._prepareContext(
      this.calendarConfig.id,
      this.calendarConfig.calendarName,
      this.calendarConfig,
    );

    this.$_accessoryManager.register(
      _calendarContext.serialNumber,
      CalendarAccessory as IBaseAccessoryCtor<TPlatformAccessories>,
      _calendarContext,
    );

    this.calendarConfig.calendarEvents.forEach((event: CalendarEventConfig) => {
      const _eventContext = this._prepareContext(
        event.id,
        event.safeEventName,
        this.calendarConfig,
        event,
      );
      this.$_accessoryManager.register(
        _eventContext.serialNumber,
        EventAccessory as IBaseAccessoryCtor<TPlatformAccessories>,
        _eventContext,
      );

      event.calendarEventNotifications
        .forEach((notification: CalendarEventNotificationConfig) => {
          const _notificationContext = this._prepareContext(
            notification.id,
            notification.notificationName,
            this.calendarConfig,
            event,
            notification,
          );
          this.$_accessoryManager.register(
            _notificationContext.serialNumber,
            NotificationAccessory as IBaseAccessoryCtor<TPlatformAccessories>,
            _notificationContext,
          );
        });
    });
  }


  private async _handleCalendarFetchJob() {
    this.$_logger && this.$_logger.debug(
      'Executed calendarFetch job',
      this.calendarConfig.calendarName,
    );

    await this._calendar.update();

    this.tick();
  }

  private _calendarUpdateState(
    calendarConfig: CalendarConfig,
    activeEvents: ICalendarEvent[] = [],
    watchedActiveEvents: ICalendarEvent[] = [],
  ) {
    const _calendarAccessory = this.$_accessoryManager.get<CalendarAccessory>(
      this._generateSerialNumber(this.calendarConfig.id),
    );

    _calendarAccessory?.registerUpdateStateHandler(() => this._handleCalendarFetchJob());

    if (calendarConfig.calendarTriggerOnAllEvents) {
      if (activeEvents.length) {
        _calendarAccessory?.setActiveState(false);
      } else {
        _calendarAccessory?.setActiveState(true);
      }
    } else {
      if (watchedActiveEvents.length) {
        if (calendarConfig.calendarTriggerOnUpdates) {
          _calendarAccessory?.setActiveState(true);
          setTimeout(() => {
            _calendarAccessory?.setActiveState(false);
          }, 1000);
        } else {
          _calendarAccessory?.setActiveState(false);
        }
      } else {
        _calendarAccessory?.setActiveState(true);
      }
    }
  }

  private _calendarEventUpdateState(
    eventConfig: CalendarEventConfig,
    watchedActiveEvents: ICalendarEvent[] = [],
  ) {
    const _now = this._calendar.now();

    const _eventAccessory = this.$_accessoryManager.get<EventAccessory>(
      this._generateSerialNumber(eventConfig.id),
    );

    const _activeEvent = watchedActiveEvents
      .find((event) => {
        return eventConfig.eventMatcher.test(event.summary);
      });

    if (_activeEvent) {
      const _startTime = _activeEvent.startDate.getTime();
      const _endTime = _activeEvent.endDate.getTime();

      const _progress = (_now - _startTime) / (_endTime - _startTime) * 100;

      if (eventConfig.eventTriggerOnUpdates) {
        _eventAccessory?.setActiveState(true);
        _eventAccessory?.setProgressState(_progress);

        setTimeout(() => {
          _eventAccessory?.setActiveState(false);
        }, 1000);
      } else {
        _eventAccessory?.setProgressState(_progress);
        _eventAccessory?.setActiveState(false);
      }
    } else {
      _eventAccessory?.setActiveState(true);
      _eventAccessory?.setProgressState(0);
    }
  }

  private _calendarEventNotificationUpdateState(
    eventConfig: CalendarEventConfig,
    eventNotificationConfig: CalendarEventNotificationConfig,
  ) {
    const _now = this._calendar.now();

    let _activeEvent: ICalendarEvent | undefined;

    const _notificationAccessory = this.$_accessoryManager.get<NotificationAccessory>(
      this._generateSerialNumber(eventNotificationConfig.id),
    );

    if (
      eventNotificationConfig.notificationStartOffsetMillis
      || eventNotificationConfig.notificationEndOffsetMillis
    ) {

      if (eventNotificationConfig.notificationStartOffsetMillis) {
        const _startTime = _now - eventNotificationConfig.notificationStartOffsetMillis;

        const _activeEvents = this._calendar.getEvents(
          _startTime,
          _startTime,
        );

        _activeEvent = _activeEvents
          .find((event) => {
            return eventConfig.eventMatcher.test(event.summary)
              && event.startDate.getTime() === _startTime;
          });
      } else if (eventNotificationConfig.notificationEndOffsetMillis) {
        const _endTime = _now - eventNotificationConfig.notificationEndOffsetMillis;

        const _activeEvents = this._calendar.getEvents(
          _endTime,
          _endTime,
        );

        _activeEvent = _activeEvents
          .find((event) => {
            return eventConfig.eventMatcher.test(event.summary)
              && event.endDate.getTime() === _endTime;
          });
      }
    }

    if (_activeEvent) {
      _notificationAccessory?.setActiveState(false);

      setTimeout(() => {
        _notificationAccessory?.setActiveState(true);
      }, 1000);
    } else {
      _notificationAccessory?.setActiveState(true);
    }
  }

  private _generateSerialNumber(id: string): string {
    return this.$_api.hap.uuid.generate(id);
  }

  private _prepareContext(
    id: string,
    name: string,
    calendarConfig: CalendarConfig,
    calendarEventConfig?: CalendarEventConfig,
    calendarEventNotificationConfig?: CalendarEventNotificationConfig,
  ): IAccessoryContext {
    return {
      manufacturer: PLATFORM_MANUFACTURER,
      model: id,
      name: name,
      serialNumber: this._generateSerialNumber(id),
      version: PLATFORM_VERSION,
      calendarConfig,
      calendarEventConfig,
      calendarEventNotificationConfig,
    };
  }
}
