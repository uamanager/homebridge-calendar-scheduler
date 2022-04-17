import { PlatformAccessory } from 'homebridge';
import { AccessoriesCache } from './accessories.cache';
import { Platform } from './platform';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { Accessory } from './types/accessory';
import { IAccessoryContext } from './types/accessory.context';
import { ICtor } from './types/ctor';

export class AccessoriesManager<AT extends Accessory> {
  private _accessories: Map<string, AT> = new Map();
  private _cacheManager: AccessoriesCache;

  constructor (private readonly platform: Platform) {
    this._cacheManager = new AccessoriesCache(platform);
    this.platform.log.debug('Finished initializing accessories manager');
  }

  cache (uuid: string, accessory: PlatformAccessory<IAccessoryContext>) {
    this._cacheManager.add(uuid, accessory);
  }

  clean () {
    this._cacheManager.forEach((value, key) => {
      const _accessory = this._cacheManager.remove(key);
      if (_accessory) {
        this.unregister(key, _accessory);
      }
    });
    this.platform.log.debug('Finished cleaning accessories cache');
  }

  get<T extends AT = AT> (uuid: string): T | undefined {
    return this._accessories.get(uuid) as T | undefined;
  }

  register (
    uuid: string,
    ctor: ICtor<AT>,
    context: IAccessoryContext,
  ) {
    const _cachedAccessory = this._cacheManager.remove(uuid);

    if (_cachedAccessory) {
      _cachedAccessory.context = { ...context };

      this._accessories.set(uuid, new ctor(this.platform, _cachedAccessory));

      this.platform.log.info('Updating accessory:', uuid, _cachedAccessory.displayName);

      return this.platform.api.updatePlatformAccessories([_cachedAccessory]);
    } else {
      const _accessory = new this.platform.api.platformAccessory(context.name, uuid);

      _accessory.context = { ...context };

      this._accessories.set(uuid, new ctor(this.platform, _accessory));

      this.platform.log.info('Registering accessory:', uuid, _accessory.displayName);

      this.platform.api.registerPlatformAccessories(
        PLUGIN_NAME,
        PLATFORM_NAME,
        [_accessory],
      );
    }
  }

  unregister (uuid: string, accessory: PlatformAccessory<IAccessoryContext>) {
    this.platform.api.unregisterPlatformAccessories(
      PLUGIN_NAME,
      PLATFORM_NAME,
      [accessory],
    );

    if (this._accessories.has(uuid)) {
      this._accessories.delete(uuid);
    }

    this.platform.log.info('Unregistering accessory:', uuid, accessory.displayName);
  }
}
