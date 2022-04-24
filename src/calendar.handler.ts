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
    private readonly calendar: CalendarConfig,
  ) {
    this.platform.log.debug(
      'Finished initializing calendar handler:',
      this.calendar.calendarName,
    );

    this._calendarFetchJob = new Job(
      `calendar-fetch-${this.calendar.calendarName}`,
      { minutes: this.calendar.calendarUpdateInterval, runImmediately: true },
      this._handleCalendarFetchJob.bind(this),
      this.platform.Scheduler,
    );

    this._calendarUpdatesJob = new Job(
      `calendar-updates-${this.calendar.calendarName}`,
      { minutes: 1, runImmediately: true },
      this._handleCalendarUpdatesJob.bind(this),
      this.platform.Scheduler,
    );

    this._calendar = new Calendar(
      this.calendar.calendarName,
      this.calendar.calendarUrl,
      this.platform.log,
    );

    this.init();
  }

  init () {
    this._initAccessories();

    this._calendarFetchJob.start();
  }

  private _initAccessories () {
    const _calendarContext = this._prepareContext(
      this.calendar.id,
      this.calendar.calendarName,
    );

    this.platform.AccessoriesManager.register(
      _calendarContext.serialNumber,
      CalendarAccessory,
      _calendarContext,
    );

    this.calendar.calendarEvents.forEach((event: CalendarEventConfig) => {
      const _eventContext = this._prepareContext(event.id, event.eventName);
      this.platform.AccessoriesManager.register(
        _eventContext.serialNumber,
        EventAccessory,
        _eventContext,
      );
    });
  }


  private async _handleCalendarFetchJob () {
    this.platform.log.debug('Executed calendarFetch job', this.calendar.calendarName);

    await this._calendar.update();

    this._calendarUpdatesJob.restart();
  }

  private _handleCalendarUpdatesJob () {
    this.platform.log.debug('Executed calendarUpdates job', this.calendar.calendarName);

    const _now = new Date().getTime();

    const _watchedEvents = this.calendar.calendarEvents.map(event => event.eventName);

    const _watchedActiveEvents = this._calendar.getEvents()
      .filter((event) => _watchedEvents.includes(event.summary));

    const _calendarAccessory = this.platform.AccessoriesManager.get<CalendarAccessory>(
      this._generateSerialNumber(this.calendar.id),
    );

    if (_watchedActiveEvents.length) {
      if (this.calendar.calendarTriggerOnUpdates) {
        _calendarAccessory?.setContactSensorState(true);
        setTimeout(() => {
          _calendarAccessory?.setContactSensorState(false);
        }, 1000);
      } else {
        _calendarAccessory?.setContactSensorState(false);
      }
    } else {
      _calendarAccessory?.setContactSensorState(true);
    }

    this.calendar.calendarEvents.forEach((eventConfig) => {
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
          _eventAccessory?.setContactSensorState(true);
          _eventAccessory?.setCurrentAmbientLightState(_progress);

          setTimeout(() => {
            _eventAccessory?.setContactSensorState(false);
          }, 1000);
        } else {
          _eventAccessory?.setCurrentAmbientLightState(_progress);
          _eventAccessory?.setContactSensorState(false);
        }
      } else {
        _eventAccessory?.setContactSensorState(true);
        _eventAccessory?.setCurrentAmbientLightState(0);
      }
    });
  }

  private _generateSerialNumber (id: string): string {
    return this.platform.api.hap.uuid.generate(id);
  }

  private _prepareContext (id: string, name: string): IAccessoryContext {
    return {
      manufacturer: PLATFORM_MANUFACTURER,
      model: id,
      name: name,
      serialNumber: this._generateSerialNumber(id),
      version: PLATFORM_VERSION,
    };
  }
}
