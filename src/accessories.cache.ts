import { PlatformAccessory } from 'homebridge';
import { Platform } from './platform';
import { IAccessoryContext } from './types/accessory.context';

export class AccessoriesCache {
  private _cache: Map<string, PlatformAccessory<IAccessoryContext>> = new Map();

  constructor (private readonly platform: Platform) {
    this.platform.log.info('Finished initializing accessories cache');
  }

  add (uuid: string, accessory: PlatformAccessory<IAccessoryContext>) {
    this.platform.log.info(
      'Adding existing accessory to cache manager:',
      uuid,
      accessory.displayName,
    );
    this._cache.set(uuid, accessory);
  }

  forEach (callbackFn: (
    value: PlatformAccessory<IAccessoryContext>,
    key: string,
    map: Map<string, PlatformAccessory<IAccessoryContext>>,
  ) => void, thisArg?) {
    this._cache.forEach(callbackFn, thisArg);
  }

  remove (uuid: string): PlatformAccessory<IAccessoryContext> | undefined {
    this.platform.log.info(
      'Trying to remove existing accessory from cache manager:',
      uuid,
    );
    const _accessory = this._cache.get(uuid);

    if (_accessory) {
      this._cache.delete(uuid);
      this.platform.log.info(
        'Removing existing accessory from cache manager:',
        uuid,
        _accessory.displayName,
      );
    }

    return _accessory;
  }
}
