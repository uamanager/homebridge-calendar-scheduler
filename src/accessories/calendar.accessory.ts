import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { Platform } from '../platform';
import { Accessory } from '../types/accessory';
import { IAccessoryContext } from '../types/accessory.context';


export class CalendarAccessory extends Accessory {
  protected ContactSensor: Service;
  protected _activeState = true;

  constructor (
    protected readonly platform: Platform,
    protected readonly accessory: PlatformAccessory<IAccessoryContext>,
  ) {
    super(platform, accessory);
    this._setAccessoryInformation(
      this.accessory.context.manufacturer,
      this.accessory.context.model,
      this.accessory.context.serialNumber,
      this.accessory.context.version,
    );

    this.ContactSensor = this._getService(
      this.accessory.context.name,
      this.platform.Service.ContactSensor,
    );

    this.ContactSensor.getCharacteristic(this.platform.Characteristic.ContactSensorState)
      .onGet(this.getActiveState.bind(this));
  }

  async getActiveState (): Promise<CharacteristicValue> {
    const state = this._activeState
                  ? this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED
                  : this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;

    this.platform.debug(
      `[${this.accessory.context.name}] Get ActiveState On ->`,
      this._activeState,
    );

    return state;
  }

  async setActiveState (state: boolean) {
    const _state = state
                   ? this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED
                   : this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;

    if (state !== this._activeState) {
      this._activeState = state;

      this.platform.debug(
        `[${this.accessory.context.name}] Set ActiveState On ->`,
        state,
      );

      this.ContactSensor.updateCharacteristic(
        this.platform.Characteristic.ContactSensorState,
        _state,
      );
    }
  }
}
