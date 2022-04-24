import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { Platform } from '../platform';
import { Accessory } from '../types/accessory';
import { IAccessoryContext } from '../types/accessory.context';


export class CalendarAccessory extends Accessory {
  protected ContactSensor: Service;
  protected contactSensorState = true;

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
      .onGet(this.getContactSensorState.bind(this));
  }

  async getContactSensorState (): Promise<CharacteristicValue> {
    const state = this.contactSensorState
                  ? this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED
                  : this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;

    this.platform.log.debug(
      `[${this.accessory.context.name}] Get ContactSensorState On ->`,
      state,
    );

    return state;
  }

  async setContactSensorState (state: boolean) {
    const _state = state
                   ? this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED
                   : this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;

    this.contactSensorState = state;

    this.platform.log.debug(
      `[${this.accessory.context.name}] Set ContactSensorState On ->`,
      _state,
    );

    this.ContactSensor.updateCharacteristic(
      this.platform.Characteristic.ContactSensorState,
      _state,
    );
  }
}
