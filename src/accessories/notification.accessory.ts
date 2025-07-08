import { API, CharacteristicValue, Logger, PlatformAccessory, Service } from 'homebridge';
import { IAccessoryContext } from './accessory.context.js';
import { BaseAccessory } from 'homebridge-util-accessory-manager';


export class NotificationAccessory extends BaseAccessory<IAccessoryContext> {
  protected _activeState = true;
  protected $_contactSensorService: Service;

  constructor(
    protected readonly $_api: API,
    protected readonly _accessory: PlatformAccessory<IAccessoryContext>,
    protected readonly $_logger?: Logger,
  ) {
    super($_api, _accessory, $_logger);

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
  }

  async getActiveState(): Promise<CharacteristicValue> {
    const state = this._activeState
      ? this.$_api.hap.Characteristic.ContactSensorState.CONTACT_DETECTED
      : this.$_api.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;

    this.$_logger?.debug(
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

      this.$_logger?.debug(
        `[${this._accessory.context.name}] Set ActiveState On ->`,
        state ? 'CONTACT_DETECTED' : 'CONTACT_NOT_DETECTED',
      );

      this.$_contactSensorService.updateCharacteristic(
        this.$_api.hap.Characteristic.ContactSensorState,
        _state,
      );
    }
  }
}
