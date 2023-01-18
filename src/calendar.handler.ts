import { CalendarAccessory } from './accessories/calendar.accessory';
import { EventAccessory } from './accessories/event.accessory';
import { Calendar, ICalendarEvent } from './calendar';
import { Platform } from './platform';
import { PLATFORM_MANUFACTURER, PLATFORM_VERSION } from './settings';
import { IAccessoryContext } from './accessories/accessory.context';
import { CalendarConfig } from './configs/calendar.config';
import { CalendarEventConfig } from './configs/event.config';
import { Job } from './job.manager';

export class CalendarHandler {
  private _calendarFetchJob: Job;
  private _calendarUpdatesJob: Job;
  private _calendar: Calendar;

  constructor(
    private readonly platform: Platform,
    private readonly calendarConfig: CalendarConfig,
  ) {
    this.platform.debug(
      'Finished initializing calendar handler:',
      this.calendarConfig.calendarName,
    );

    this._calendarFetchJob = new Job(
      `calendar-fetch-${this.calendarConfig.calendarName}`,
      { minutes: this.calendarConfig.calendarUpdateInterval, runImmediately: true },
      this._handleCalendarFetchJob.bind(this),
      this.platform.Scheduler,
    );

    this._calendarUpdatesJob = new Job(
      `calendar-updates-${this.calendarConfig.calendarName}`,
      { minutes: 1, runImmediately: true },
      this._handleCalendarUpdatesJob.bind(this),
      this.platform.Scheduler,
    );

    this._calendar = new Calendar(
      this.calendarConfig.calendarName,
      this.calendarConfig.calendarUrl,
      this.platform,
    );

    this.init();
  }

  private get _now(): number {
    return new Date().getTime();
  }

  init() {
    this._initAccessories();

    this._calendarFetchJob.start();
  }

  private _initAccessories() {
    const _calendarContext = this._prepareContext(
      this.calendarConfig.id,
      this.calendarConfig.calendarName,
      this.calendarConfig,
    );

    this.platform.AccessoriesManager.register(
      _calendarContext.serialNumber,
      CalendarAccessory,
      _calendarContext,
    );

    this.calendarConfig.calendarEvents.forEach((event: CalendarEventConfig) => {
      const _eventContext = this._prepareContext(
        event.id,
        event.safeEventName,
        this.calendarConfig,
        event,
      );
      this.platform.AccessoriesManager.register(
        _eventContext.serialNumber,
        EventAccessory,
        _eventContext,
      );
    });
  }


  private async _handleCalendarFetchJob() {
    this.platform.debug('Executed calendarFetch job', this.calendarConfig.calendarName);

    await this._calendar.update();

    this._calendarUpdatesJob.restart();
  }

  private _handleCalendarUpdatesJob() {
    this.platform.debug('Executed calendarUpdates job', this.calendarConfig.calendarName);

    const _activeEvents = this._calendar.getEvents();

    const _watchedActiveEvents = _activeEvents.filter((event) => {
      return this.calendarConfig.calendarEvents.findIndex((watchedEvent) => {
        return watchedEvent.eventMatcher.test(event.summary);
      }) !== -1;
    });

    this._calendarUpdateState(this.calendarConfig, _activeEvents, _watchedActiveEvents);

    this.calendarConfig.calendarEvents.forEach((eventConfig) => {
      this._calendarEventUpdateState(eventConfig, _watchedActiveEvents);
    });
  }

  private _calendarUpdateState(
    calendarConfig: CalendarConfig,
    activeEvents: ICalendarEvent[] = [],
    watchedActiveEvents: ICalendarEvent[] = [],
  ) {
    const _calendarAccessory = this.platform.AccessoriesManager.get<CalendarAccessory>(
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
    const _eventAccessory = this.platform.AccessoriesManager.get<EventAccessory>(
      this._generateSerialNumber(eventConfig.id),
    );

    const _activeEvent = watchedActiveEvents
      .find((event) => {
        return eventConfig.eventMatcher.test(event.summary);
      });

    if (_activeEvent) {
      const _startTime = _activeEvent.startDate.getTime();
      const _endTime = _activeEvent.endDate.getTime();

      const _progress = (this._now - _startTime) / (_endTime - _startTime) * 100;

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

  private _generateSerialNumber(id: string): string {
    return this.platform.api.hap.uuid.generate(id);
  }

  private _prepareContext(
    id: string,
    name: string,
    calendarConfig: CalendarConfig,
    calendarEventConfig?: CalendarEventConfig,
  ): IAccessoryContext {
    return {
      manufacturer: PLATFORM_MANUFACTURER,
      model: id,
      name: name,
      serialNumber: this._generateSerialNumber(id),
      version: PLATFORM_VERSION,
      calendarConfig,
      calendarEventConfig,
    };
  }
}
