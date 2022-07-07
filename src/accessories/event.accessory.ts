import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';

import { Platform } from '../platform';
import { IAccessoryContext } from '../types/accessory.context';
import { CalendarAccessory } from './calendar.accessory';


export class EventAccessory extends CalendarAccessory {
  protected LightSensor: Service;

  protected _progressState = 0.0001;

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
      .onGet(this.getProgressLevel.bind(this));
  }


  async getProgressLevel (): Promise<CharacteristicValue> {
    const state = Math.max(
      0.0001,
      Math.min(100, Math.round(this._progressState)),
    );

    this.platform.debug(
      `[${this.accessory.context.name} Progress] Get ProgressState On ->`,
      state,
    );

    return state;
  }

  async setProgressState (state: number) {
    const _state = Math.max(0.0001, Math.min(100, Math.round(state)));

    if (_state !== this._progressState) {
      this._progressState = _state;

      this.platform.debug(
        `[${this.accessory.context.name}] Set ProgressState On ->`,
        _state,
      );

      this.LightSensor.updateCharacteristic(
        this.platform.Characteristic.CurrentAmbientLightLevel,
        _state,
      );
    }
  }
}
