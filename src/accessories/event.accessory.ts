import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { Platform } from '../platform';
import { IAccessoryContext } from '../types/accessory.context';
import { CalendarAccessory } from './calendar.accessory';


export class EventAccessory extends CalendarAccessory {
  protected LightSensor: Service;

  protected CurrentAmbientLightLevel = 0;

  constructor (
    protected readonly platform: Platform,
    protected readonly accessory: PlatformAccessory<IAccessoryContext>,
  ) {
    super(platform, accessory);

    this.LightSensor = this._getService(
      `${this.accessory.context.name} Progress`,
      this.platform.Service.LightSensor,
    );

    this.LightSensor.getCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel)
      .onGet(this.getCurrentAmbientLightLevel.bind(this));
  }


  async getCurrentAmbientLightLevel (): Promise<CharacteristicValue> {
    const state = Math.max(0.0001, Math.min(100, Math.round(this.CurrentAmbientLightLevel)));

    this.platform.log.debug(
      `[${this.accessory.context.name} Progress] Get CurrentAmbientLightLevel On ->`,
      state,
    );

    return state;
  }

  async setCurrentAmbientLightState (state: number) {
    const _state = Math.max(0.0001, Math.min(100, Math.round(state)));

    this.CurrentAmbientLightLevel = state;

    this.platform.log.debug(
      `[${this.accessory.context.name}] Set CurrentAmbientLightLevel On ->`,
      _state,
    );

    this.LightSensor.updateCharacteristic(
      this.platform.Characteristic.CurrentAmbientLightLevel,
      _state,
    );
  }
}
