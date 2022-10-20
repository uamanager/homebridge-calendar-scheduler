import { CalendarAccessory } from './accessories/calendar.accessory';
import { EventAccessory } from './accessories/event.accessory';
import { Calendar } from './calendar';
import { Platform } from './platform';
import { PLATFORM_MANUFACTURER, PLATFORM_VERSION } from './settings';
import { IAccessoryContext } from './types/accessory.context';
import { CalendarConfig } from './types/calendar.config';
import { CalendarEventConfig } from './types/event.config';
import { Job } from './types/job';

export class CalendarHandler {
  private _calendarFetchJob: Job;
  private _calendarUpdatesJob: Job;
  private _calendar: Calendar;

  constructor (
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

  init () {
    this._initAccessories();

    this._calendarFetchJob.start();
  }

  private _initAccessories () {
    const _calendarContext = this._prepareContext(
      !!this.calendarConfig.calendarUpdateButton,
      this.calendarConfig.id,
      this.calendarConfig.calendarName,
    );

    this.platform.AccessoriesManager.register(
      _calendarContext.serialNumber,
      CalendarAccessory,
      _calendarContext,
    );

    this.calendarConfig.calendarEvents.forEach((event: CalendarEventConfig) => {
      const _eventContext = this._prepareContext(
        false,
        event.id,
        event.eventName,
      );
      this.platform.AccessoriesManager.register(
        _eventContext.serialNumber,
        EventAccessory,
        _eventContext,
      );
    });
  }


  private async _handleCalendarFetchJob () {
    this.platform.debug('Executed calendarFetch job', this.calendarConfig.calendarName);

    await this._calendar.update();

    this._calendarUpdatesJob.restart();
  }

  private _handleCalendarUpdatesJob () {
    this.platform.debug('Executed calendarUpdates job', this.calendarConfig.calendarName);

    const _now = new Date().getTime();

    const _watchedEvents = this.calendarConfig.calendarEvents.map(event => event.eventName);

    const _activeEvents = this._calendar.getEvents();

    const _watchedActiveEvents = _activeEvents
      .filter((event) => _watchedEvents.includes(event.summary));

    const _calendarAccessory = this.platform.AccessoriesManager.get<CalendarAccessory>(
      this._generateSerialNumber(this.calendarConfig.id),
    );

    _calendarAccessory?.registerUpdateStateHandler(() => this._handleCalendarFetchJob());

    if (this.calendarConfig.calendarTriggerOnAllEvents) {
      if (_activeEvents.length) {
        _calendarAccessory?.setActiveState(false);
      } else {
        _calendarAccessory?.setActiveState(true);
      }
    } else {
      if (_watchedActiveEvents.length) {
        if (this.calendarConfig.calendarTriggerOnUpdates) {
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

    this.calendarConfig.calendarEvents.forEach((eventConfig) => {
      const _eventAccessory = this.platform.AccessoriesManager.get<EventAccessory>(
        this._generateSerialNumber(eventConfig.id),
      );

      const _activeEvent = _watchedActiveEvents
        .find(event => eventConfig.eventName === event.summary);

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
    });
  }

  private _generateSerialNumber (id: string): string {
    return this.platform.api.hap.uuid.generate(id);
  }

  private _prepareContext (
    forceUpdate: boolean,
    id: string,
    name: string,
  ): IAccessoryContext {
    return {
      forceUpdate: forceUpdate,
      manufacturer: PLATFORM_MANUFACTURER,
      model: id,
      name: name,
      serialNumber: this._generateSerialNumber(id),
      version: PLATFORM_VERSION,
    };
  }
}
