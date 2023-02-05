<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>

# 📅 Homebridge Calendar Scheduler [![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)

[![Support Ukraine Badge](https://bit.ly/support-ukraine-now)](https://github.com/support-ukraine/support-ukraine)
[!["Buy Me A Coffee"](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-ffdd00.svg)](https://www.buymeacoffee.com/uamanager)
[!["Ko-fi"](https://img.shields.io/badge/Ko--fi-donate-ff5f5f.svg)](https://ko-fi.com/uamanager)

[![npm](https://img.shields.io/npm/v/homebridge-calendar-scheduler.svg)](https://www.npmjs.com/package/homebridge-calendar-scheduler)
[![npm](https://img.shields.io/npm/dt/homebridge-calendar-scheduler.svg)](https://www.npmjs.com/package/homebridge-calendar-scheduler)
[![npm](https://img.shields.io/npm/dm/homebridge-calendar-scheduler.svg)](https://www.npmjs.com/package/homebridge-calendar-scheduler)

**Creating and maintaining Homebridge plugins consume a lot of time and effort, if you
would like to share your appreciation, feel free to "Star" or donate.**

[Click here](https://github.com/uamanager) to review more of my plugins.

## Info

Calendar Scheduler plugin for Homebridge, which allows flexible scheduling of triggers with event progress report using
any iCal calendar.

## Installation

After [Homebridge](https://github.com/nfarina/homebridge) has been installed:

```
sudo npm install -g --unsafe-perm homebridge-calendar-scheduler@latest
```

## Example Config

```json lines
{
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
          "calendarTriggerOnAllEvents": true,
          "calendarEvents": [
            {
              "eventName": "event-name-without-retrigger",
              "eventTriggerOnUpdate": false
            },
            {
              "eventName": "^event-(.*)",
              "eventTriggerOnUpdate": false,
              "calendarEventNotifications": [
                {
                  "notificationName": "event-notification-name-before-start-15m",
                  "notificationStartOffset": -15
                },
                {
                  "notificationName": "event-notification-name-after-start-15m",
                  "notificationStartOffset": 15
                },
                {
                  "notificationName": "event-notification-name-before-end-15m",
                  "notificationEndOffset": -15
                },
                {
                  "notificationName": "event-notification-name-after-end-15m",
                  "notificationEndOffset": 15
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

```

| Config Field                  | Description                                           | Default               | Required |
|-------------------------------|-------------------------------------------------------|-----------------------|----------|
| platform                      | Must always be `CalendarScheduler`.                   | `"CalendarScheduler"` | Yes      |
| caseInsensitiveEventsMatching | Enable for case insensitive events matching globally. | `false`               | No       |
| debug                         | Enable for displaying debug messages.                 | `false`               | No       |
| calendars                     | Array of watched calendars.                           | `[]`                  | No       |

| Calendar Config Field         | Description                                                                                                                                       | Default            | Required |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|----------|
| calendarName                  | A unique name for the calendar. Will be used as the accessory name and default sensor for any calendar events.                                    | `"calendar-name1"` | Yes      |
| calendarUrl                   | The address of the calendar. Can be a `webcal://`, a `http://` or an `https://` URL.                                                              | `""`               | Yes      |
| calendarUpdateInterval        | The polling interval the plugin uses to retrieve calendar updates in minutes. If not set, the plugin will update the calendar ones in 60 minutes. | `60`               | No       |
| calendarUpdateButton          | If set to true, then button for manual update available for this calendar accessory.                                                              | `true`             | No       |
| calendarTriggerOnUpdates      | If set to true, then every minute calendar sensor trigger update if any defined event is active.                                                  | `true`             | No       |
| calendarTriggerOnAllEvents    | If set to true, then calendar sensor trigger update if any event is active.                                                                       | `false`            | No       |
| caseInsensitiveEventsMatching | Enable for case insensitive events matching for this calendar.                                                                                    | `false`            | No       |
| calendarEvents                | Array of watched calendar events.                                                                                                                 | `[]`               | No       |

| Calendar Event Config Field   | Description                                                                                             | Default         | Required |
|-------------------------------|---------------------------------------------------------------------------------------------------------|-----------------|----------|
| eventName                     | A unique name for the calendar event. Will be used as calendar sensor for matched calendar event. Note that this can either be an event name or more generally a regular expression. | `"event-name1"` | Yes      |
| eventTriggerOnUpdates         | If set to true, then every minute sensor trigger update for active event.                               | `true`          | No       |
| caseInsensitiveEventsMatching | Enable for case insensitive events matching for this event.                                             | `false`         | No       |
| calendarEventNotifications    | Array of calendar event notifications.                                                                  | `[]`            | No       |

| Calendar Event Notification Config Field | Description                                                                                                                                                                                                                    | Default                | Required |
|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|----------|
| notificationName                         | A unique name for the calendar event notification. `notificationStartOffset` or `notificationEndOffset` field is required to make it work.                                                                                     | `"notification-name1"` | Yes      |
| notificationStartOffset                  | Amount of time in minutes before the event start to trigger the notification. If positive, then notification will be triggered after the event start. If negative, then notification will be triggered before the event start. | `undefined`            | No       |
| notificationEndOffset                    | Amount of time in minutes after the event end to trigger the notification. If positive then notification will be triggered after the event end. If negative, then notification will be triggered before the event end.         | `undefined`            | No       |

# Contributing

You can contribute to this homebridge plugin in following ways:

- Report issues and help verify fixes as they are checked in.
- Review the source code changes.
- Contribute bug fixes.
- Contribute changes to extend the capabilities
- Pull requests are accepted.

See [CONTRIBUTING](https://github.com/uamanager/homebridge-calendar-scheduler/blob/master/CONTRIBUTING.md)
