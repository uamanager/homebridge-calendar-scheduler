import { API } from 'homebridge';
import { Platform } from './platform';
import { PLATFORM_NAME } from './settings';

/**
 * This method registers the platform with Homebridge
 */
export = (api: API) => {
  try {
    api.registerPlatform(PLATFORM_NAME, Platform);
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to initialize platform:', PLATFORM_NAME, error);
  }
};
