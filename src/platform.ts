import { API, Characteristic, DynamicPlatformPlugin, Logger, PlatformAccessory, Service } from 'homebridge';
import { ToadScheduler } from 'toad-scheduler';
import { AccessoriesManager } from './accessories.manager';
import { CalendarAccessory } from './accessories/calendar.accessory';
import { EventAccessory } from './accessories/event.accessory';
import { CalendarHandler } from './calendar.handler';
import { PLATFORM_NAME } from './settings';
import { IAccessoryContext } from './accessories/accessory.context';
import { Config, IConfig } from './configs/config';

export type TPlatformAccessories = EventAccessory | CalendarAccessory;

export class Platform implements DynamicPlatformPlugin {
  readonly Service: typeof Service = this.api.hap.Service;
  readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
  readonly Scheduler: ToadScheduler = new ToadScheduler();

  CalendarHandlers: CalendarHandler[] = [];
  Config: Config = new Config();
  readonly AccessoriesManager: AccessoriesManager<TPlatformAccessories> = new AccessoriesManager(
    this,
  );

  constructor(
    public readonly log: Logger,
    public readonly config: IConfig,
    public readonly api: API,
  ) {
    this.info('Finished initializing platform:', PLATFORM_NAME);

    this.api.on('didFinishLaunching', this.didFinishLaunching.bind(this));
  }

  configureAccessory(accessory: PlatformAccessory<IAccessoryContext>) {
    this.debug('Loading accessory from cache:', accessory.displayName);
    this.AccessoriesManager.cache(accessory.UUID, accessory);
  }

  didFinishLaunching() {
    this.Config = new Config(this.config);
    this.CalendarHandlers = this.Config.calendars.map((calendar) => {
      return new CalendarHandler(this, calendar);
    });

    this.AccessoriesManager.clean();
  }

  info(message: string, ...parameters: unknown[]) {
    this.log.info(message, ...parameters);
  }

  warn(message: string, ...parameters: unknown[]) {
    this.log.warn(message, ...parameters);
  }

  error(message: string, ...parameters: unknown[]) {
    this.log.error(message, ...parameters);
  }

  debug(message: string, ...parameters: unknown[]) {
    if (this.config.debug) {
      this.log.info(message, ...parameters);
    }
  }
}
