<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>

# Homebridge Calendar Scheduler [![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)

[![Support Ukraine Badge](https://bit.ly/support-ukraine-now)](https://github.com/support-ukraine/support-ukraine)
[!["Buy Me A Coffee"](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-ffdd00.svg)](https://www.buymeacoffee.com/uamanager)
[!["Ko-fi"](https://img.shields.io/badge/Ko--fi-donate-ff5f5f.svg)](https://ko-fi.com/uamanager)

**Creating and maintaining Homebridge plugins consume a lot of time and effort, if you
would like to share your appreciation, feel free to "Star" or donate.**

[Click here](https://github.com/uamanager) to review more of my plugins.

## Info

Calendar Scheduler plugin for Homebridge, which allows flexible scheduling of triggers with repeats using any iCal calendar.

## Installation

After [Homebridge](https://github.com/nfarina/homebridge) has been installed:

```
sudo npm install -g --unsafe-perm homebridge-calendar-scheduler@latest
```

## Example Config

```
{
   ...
    "platforms": [
        {
            "platform": "CalendarScheduler",
            "debug": false,
            "calendars": [
                {
                    "calendarName": "calendar-1",
                    "calendarUrl": "https://calendar.google.com/calendar/ical/{...}.ics",
                    "calendarUpdateInterval": 3,
                    "calendarTriggerOnUpdates": true,
                    "calendarUpdateButton": false,
                    "calendarEvents": [
                        {
                            "eventName": "event-name1"
                        },
                        {
                            "eventName": "event-name-with-retrigger",
                            "eventTriggerOnUpdate": true
                        }
                    ]
                },
                {
                    "calendarName": "calendar-2",
                    "calendarUrl": "https://calendar.google.com/calendar/ical/{...}.ics",
                    "calendarUpdateInterval": 30,
                    "calendarTriggerOnUpdates": false,
                    "calendarEvents": [
                        {
                            "eventName": "event-name-without-retrigger",
                            "eventTriggerOnUpdate": false
                        }
                    ]
                }
            ]
        }
    ]
}

```

| Fields                   | Description                                                                                                                                       | Default               | Required |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|----------|
| **platform**             | Must always be `CalendarScheduler`.                                                                                                               | `"CalendarScheduler"` | Yes      |
| **debug**                | Enable for displaying debug messages.                                                                                                             | `true`                | No       |
| **calendars**            | Array of watched calendars.                                                                                                                       |                       | No       |
| calendarName             | A unique name for the calendar. Will be used as the accessory name and default sensor for any calendar events.                                    | `"calendar-name1"`    | Yes      |
| calendarUrl              | The address of the calendar. Can be a `webcal://`, a `http://` or an `https://` URL.                                                              | `""`                  | Yes      |
| calendarUpdateInterval   | The polling interval the plugin uses to retrieve calendar updates in minutes. If not set, the plugin will update the calendar ones in 60 minutes. | `60`                  | No       |
| calendarUpdateButton     | If set to true, then button for manual update available for each configured calendar.                                                             | `false`               | No       |
| calendarTriggerOnUpdates | If set to true, then every minute calendar sensor trigger update if any active event.                                                             | `true`                | No       |
| **calendarEvents**       | Array of watched calendar events.                                                                                                                 |                       | No       |
| eventName                | A unique name for the calendar event. Will be used as calendar sensor for matched calendar event.                                                 | `"event-name1"`       | Yes      |
| eventTriggerOnUpdates    | If set to true, then every minute sensor trigger update for active event.                                                                         | `true`                | No       |

# Contributing

You can contribute to this homebridge plugin in following ways:

- Report issues and help verify fixes as they are checked in.
- Review the source code changes.
- Contribute bug fixes.
- Contribute changes to extend the capabilities
- Pull requests are accepted.

See [CONTRIBUTING](https://github.com/uamanager/homebridge-calendar-scheduler/blob/master/CONTRIBUTING.md)
