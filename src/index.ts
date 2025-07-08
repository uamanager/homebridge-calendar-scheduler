import { API } from 'homebridge';
import { Platform } from './platform.js';
import { PLATFORM_NAME } from './settings.js';

/**
 * This method registers the platform with Homebridge
 */
export default (api: API) => {
  try {
    api.registerPlatform(PLATFORM_NAME, Platform);
  } catch (error) {
    console.error('Unable to initialize platform:', PLATFORM_NAME, error);
  }
};
