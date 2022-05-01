import {
  API,
  Characteristic,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  PlatformConfig,
  Service,
} from 'homebridge';
import { ToadScheduler } from 'toad-scheduler';
import { AccessoriesManager } from './accessories.manager';
import { CalendarAccessory } from './accessories/calendar.accessory';
import { EventAccessory } from './accessories/event.accessory';
import { CalendarHandler } from './calendar.handler';
import { PLATFORM_NAME } from './settings';
import { IAccessoryContext } from './types/accessory.context';
import { CalendarConfig } from './types/calendar.config';

export type TPlatformAccessories = EventAccessory | CalendarAccessory;

export class Platform implements DynamicPlatformPlugin {
  readonly Service: typeof Service = this.api.hap.Service;
  readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
  readonly Scheduler: ToadScheduler = new ToadScheduler();

  CalendarHandlers: CalendarHandler[] = [];
  readonly AccessoriesManager: AccessoriesManager<TPlatformAccessories> = new AccessoriesManager(
    this,
  );

  constructor (
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.info('Finished initializing platform:', PLATFORM_NAME);

    this.api.on('didFinishLaunching', this.didFinishLaunching.bind(this));
  }

  configureAccessory (accessory: PlatformAccessory<IAccessoryContext>) {
    this.log.info('Loading accessory from cache:', accessory.displayName);
    this.AccessoriesManager.cache(accessory.UUID, accessory);
  }

  didFinishLaunching () {
    this.CalendarHandlers = this.config.calendars
      .map((calendar) => new CalendarConfig(calendar))
      .map((calendar) => {
        return new CalendarHandler(this, calendar);
      });


    this.AccessoriesManager.clean();
  }
}
