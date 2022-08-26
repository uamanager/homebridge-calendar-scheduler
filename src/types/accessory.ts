import { Service, WithUUID } from 'hap-nodejs';
import { PlatformAccessory } from 'homebridge';
import { Platform } from '../platform';
import { IAccessoryContext } from './accessory.context';

export abstract class Accessory {
  protected constructor (
    protected readonly platform: Platform,
    protected readonly accessory: PlatformAccessory<IAccessoryContext>,
  ) {}

  protected _setAccessoryInformation (
    manufacturer: string,
    model: string,
    serialNumber: string,
    version: string,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, manufacturer)
      .setCharacteristic(this.platform.Characteristic.Model, model)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, serialNumber)
      .setCharacteristic(this.platform.Characteristic.FirmwareRevision, version);
  }

  protected _getService<T extends WithUUID<typeof Service>> (
    name: string,
    service: T,
  ): Service {
    return (this.accessory.getService(service) || this.accessory.addService(service))
      .setCharacteristic(this.platform.Characteristic.Name, name);
  }

  protected _removeService<T extends WithUUID<typeof Service>> (
    service: T,
  ): void {
    const _service = this.accessory.getService(service);
    if (_service) {
      this.accessory.removeService(_service);
    }
  }
}
