import { API, CharacteristicValue, Logger, PlatformAccessory, Service } from 'homebridge';
import { IAccessoryContext } from './accessory.context';
import { CalendarAccessory } from './calendar.accessory';


export class EventAccessory extends CalendarAccessory {
  protected _progressState = 0.0001;
  protected $_lightSensorService: Service;

  constructor(
    protected readonly $_api: API,
    protected readonly _accessory: PlatformAccessory<IAccessoryContext>,
    protected readonly $_logger?: Logger,
  ) {
    super($_api, _accessory, $_logger);

    this.$_lightSensorService = this._getService(
      `${this._accessory.context.name} Progress`,
      this.$_api.hap.Service.LightSensor,
    );

    this.$_lightSensorService
      .getCharacteristic(this.$_api.hap.Characteristic.CurrentAmbientLightLevel)
      .onGet(this.getProgressLevel.bind(this));
  }


  async getProgressLevel(): Promise<CharacteristicValue> {
    const state = Math.max(
      0.0001,
      Math.min(100, Math.round(this._progressState)),
    );

    this.$_logger && this.$_logger.debug(
      `[${this._accessory.context.name} Progress] Get ProgressState On ->`,
      state,
    );

    return state;
  }

  async setProgressState(state: number) {
    const _state = Math.max(0.0001, Math.min(100, Math.round(state)));

    if (_state !== this._progressState) {
      this._progressState = _state;

      this.$_logger && this.$_logger.debug(
        `[${this._accessory.context.name}] Set ProgressState On ->`,
        _state,
      );

      this.$_lightSensorService.updateCharacteristic(
        this.$_api.hap.Characteristic.CurrentAmbientLightLevel,
        _state,
      );
    }
  }
}
