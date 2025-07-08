import { API, DynamicPlatformPlugin, Logger, PlatformAccessory } from 'homebridge';
import { ToadScheduler } from 'toad-scheduler';
import { CalendarAccessory } from './accessories/calendar.accessory.js';
import { EventAccessory } from './accessories/event.accessory.js';
import { CalendarHandler } from './calendar.handler.js';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';
import { IAccessoryContext } from './accessories/accessory.context.js';
import { Config, IConfig } from './configs/config.js';
import { AccessoriesManager } from 'homebridge-util-accessory-manager';
import { CSLogger } from './logger.js';
import { Ticker } from './ticker.js';
import { NotificationAccessory } from './accessories/notification.accessory.js';

export type TPlatformAccessories = EventAccessory | CalendarAccessory | NotificationAccessory;

export class Platform implements DynamicPlatformPlugin {
  calendarHandlers: CalendarHandler[] = [];
  config: Config = new Config();
  readonly $_logger: Logger;
  readonly $_scheduler: ToadScheduler = new ToadScheduler();
  readonly $_ticker: Ticker;
  readonly $_accessoryManager: AccessoriesManager<TPlatformAccessories, IAccessoryContext>;

  constructor(
    private readonly $_homebridgeLogger: Logger,
    private readonly _rawConfig: IConfig,
    private readonly $_api: API,
  ) {
    this.$_logger = new CSLogger($_homebridgeLogger, _rawConfig.debug);

    this.$_ticker = new Ticker(this.$_scheduler, this.$_logger);

    this.$_accessoryManager = new AccessoriesManager(
      PLUGIN_NAME,
      PLATFORM_NAME,
      this.$_api,
      this.$_logger,
    );

    this.$_logger.info('Finished initializing platform:', PLATFORM_NAME);

    this.$_api.on('didFinishLaunching', this.didFinishLaunching.bind(this));
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.$_logger.debug('Loading accessory from cache:', accessory.displayName);
    this.$_accessoryManager.cache(accessory.UUID, accessory as PlatformAccessory<IAccessoryContext>);
  }

  didFinishLaunching() {
    this.config = new Config(this._rawConfig);
    this.calendarHandlers = this.config.calendars.map((calendar) => {
      return new CalendarHandler(
        this.$_api,
        calendar,
        this.$_accessoryManager,
        this.$_scheduler,
        this.$_logger,
      );
    });

    if (this.calendarHandlers.length) {
      this.calendarHandlers.forEach((calendarHandler) => {
        this.$_ticker.attach(() => {
          calendarHandler.tick();
        });
      });

      this.$_ticker.start();
    }

    this.$_accessoryManager.clean();
  }
}
