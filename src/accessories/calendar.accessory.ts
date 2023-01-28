import { API, CharacteristicValue, Logger, PlatformAccessory, Service } from 'homebridge';
import { IAccessoryContext } from './accessory.context';
import { NotificationAccessory } from './notification.accessory';


export class CalendarAccessory extends NotificationAccessory {
  protected _updateStateHandler: () => Promise<void>;
  protected $_switchService?: Service;

  constructor(
    protected readonly $_api: API,
    protected readonly _accessory: PlatformAccessory<IAccessoryContext>,
    protected readonly $_logger?: Logger,
  ) {
    super($_api, _accessory, $_logger);

    this._updateStateHandler = () => Promise.resolve();

    if (this._accessory.context.calendarConfig.calendarUpdateButton) {
      this.$_switchService = this._getService(
        `${this._accessory.context.name} Update`,
        this.$_api.hap.Service.Switch,
      );

      this.$_switchService.getCharacteristic(this.$_api.hap.Characteristic.On)
        .onGet(this.getUpdateState.bind(this))
        .onSet(this.setUpdateState.bind(this));
    } else {
      this._removeService(this.$_api.hap.Service.Switch);
      this.$_switchService = undefined;
    }
  }

  registerUpdateStateHandler(handler: () => Promise<void>) {
    this._updateStateHandler = handler;
  }

  async getUpdateState(): Promise<CharacteristicValue> {
    return false;
  }

  async setUpdateState(state) {
    this.$_logger && this.$_logger.debug(
      `[${this._accessory.context.name}] Set UpdateState On ->`,
      state,
    );

    return this._updateStateHandler();
  }
}
