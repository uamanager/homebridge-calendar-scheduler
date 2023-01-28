import { API, CharacteristicValue, Logger, PlatformAccessory, Service } from 'homebridge';
import { IAccessoryContext } from './accessory.context';
import { CalendarAccessory } from './calendar.accessory';
import { CalendarEventNotificationConfig } from '../configs/notification.config';


export class EventAccessory extends CalendarAccessory {
  protected _progressState = 0.0001;
  protected $_lightSensorService: Service;
  protected _eventNotificationStates: Map<string, boolean> = new Map<string, boolean>();
  protected _eventNotifications: Map<string, Service> = new Map();

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

    if (
      this._accessory.context.calendarEventConfig
      && this._accessory.context.calendarEventConfig.calendarEventNotifications.length
    ) {
      this._accessory.context.calendarEventConfig.calendarEventNotifications
        .forEach((eventNotificationConfig: CalendarEventNotificationConfig) => {
          this._eventNotificationStates.set(eventNotificationConfig.notificationName, true);

          const _notificationService = this._getService(
            `${this._accessory.context.name} ${eventNotificationConfig.notificationName}`,
            this.$_api.hap.Service.ContactSensor,
          );

          _notificationService.getCharacteristic(this.$_api.hap.Characteristic.ContactSensorState)
            .onGet(() => {
              const _state = this._eventNotificationStates.get(
                eventNotificationConfig.notificationName,
              );

              this.$_logger && this.$_logger.debug(
                // eslint-disable-next-line max-len
                `[${this._accessory.context.name}] Get ${eventNotificationConfig.notificationName} On ->`,
                _state ? 'CONTACT_DETECTED' : 'CONTACT_NOT_DETECTED',
              );

              return _state
                ? this.$_api.hap.Characteristic.ContactSensorState.CONTACT_DETECTED
                : this.$_api.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
            });
        });
    }
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

  async setNotificationState(
    eventNotificationName: string,
    state: boolean,
  ) {
    const _state = state
      ? this.$_api.hap.Characteristic.ContactSensorState.CONTACT_DETECTED
      : this.$_api.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;

    const _oldState = this._eventNotificationStates.get(eventNotificationName);

    if (state !== _oldState) {
      this._eventNotificationStates.set(eventNotificationName, state);

      this.$_logger && this.$_logger.debug(
        `[${this._accessory.context.name}] Set ${eventNotificationName} On ->`,
        state ? 'CONTACT_DETECTED' : 'CONTACT_NOT_DETECTED',
      );

      const _service = this._eventNotifications.get(eventNotificationName);

      if (_service) {
        _service.updateCharacteristic(
          this.$_api.hap.Characteristic.ContactSensorState,
          _state,
        );
      }
    }
  }
}
