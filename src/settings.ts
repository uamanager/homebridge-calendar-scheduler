import pkg from '../package.json' with { type: 'json' };

export const PLATFORM_NAME = 'CalendarScheduler';

export const PLUGIN_NAME = pkg.name;

export const PLATFORM_MANUFACTURER = pkg.author.name;

export const PLATFORM_VERSION = pkg.version;
