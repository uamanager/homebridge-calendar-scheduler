import { API, CharacteristicValue, Logger, PlatformAccessory, Service } from 'homebridge';
import { IAccessoryContext } from './accessory.context';
import { BaseAccessory } from 'homebridge-util-accessory-manager';


export class CalendarAccessory extends BaseAccessory<IAccessoryContext> {
  protected _activeState = true;
  protected _updateStateHandler: () => Promise<void>;
  protected $_contactSensorService: Service;
  protected $_switchService?: Service;

  constructor(
    protected readonly $_api: API,
    protected readonly _accessory: PlatformAccessory<IAccessoryContext>,
    protected readonly $_logger?: Logger,
  ) {
    super($_api, _accessory, $_logger);

    this._updateStateHandler = () => Promise.resolve();

    this._setAccessoryInformation(
      this._accessory.context.manufacturer,
      this._accessory.context.model,
      this._accessory.context.serialNumber,
      this._accessory.context.version,
    );

    this.$_contactSensorService = this._getService(
      this._accessory.context.name,
      this.$_api.hap.Service.ContactSensor,
    );

    this.$_contactSensorService.getCharacteristic(this.$_api.hap.Characteristic.ContactSensorState)
      .onGet(this.getActiveState.bind(this));

    if (
      this._accessory.context.calendarConfig.calendarUpdateButton
      && !this._accessory.context.calendarEventConfig
    ) {
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

  async getActiveState(): Promise<CharacteristicValue> {
    const state = this._activeState
      ? this.$_api.hap.Characteristic.ContactSensorState.CONTACT_DETECTED
      : this.$_api.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;

    this.$_logger && this.$_logger.debug(
      `[${this._accessory.context.name}] Get ActiveState On ->`,
      this._activeState ? 'CONTACT_DETECTED' : 'CONTACT_NOT_DETECTED',
    );

    return state;
  }

  async setActiveState(state: boolean) {
    const _state = state
      ? this.$_api.hap.Characteristic.ContactSensorState.CONTACT_DETECTED
      : this.$_api.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;

    if (state !== this._activeState) {
      this._activeState = state;

      this.$_logger && this.$_logger.debug(
        `[${this._accessory.context.name}] Set ActiveState On ->`,
        state ? 'CONTACT_DETECTED' : 'CONTACT_NOT_DETECTED',
      );

      this.$_contactSensorService.updateCharacteristic(
        this.$_api.hap.Characteristic.ContactSensorState,
        _state,
      );
    }
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
