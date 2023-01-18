import IcalExpander from 'ical-expander';
import { requestHelper } from './helpers/request.helper';
import { Platform } from './platform';

export interface ICalendarEvent {
  summary: string;
  startDate: Date;
  endDate: Date;
}

export interface ICalendarEventRaw {
  events: ICalendarEventRawEvent[];
  occurrences: ICalendarEventRawOccurrence[];
}

export interface ICalendarEventRawEvent {
  summary: string;
  startDate: ICalendarEventRawDate;
  endDate: ICalendarEventRawDate;
}

export interface ICalendarEventRawOccurrence {
  item: {
    summary: string;
  };
  startDate: ICalendarEventRawDate;
  endDate: ICalendarEventRawDate;
}

export interface ICalendarEventRawDate {
  toJSDate: () => Date;
}

export class Calendar {
  protected _platform: Platform;

  protected _name: string;
  protected _url: string;
  protected _calendar: IcalExpander;

  constructor(name: string, url: string, platform: Platform) {
    this._name = name;
    this._url = url.replace('webcal://', 'https://');
    this._platform = platform;
  }

  async update() {
    this._platform.debug('Updating calendar:', this._name);
    try {
      const _data = await requestHelper(this._url);
      if (_data) {
        this._calendar = new IcalExpander({ ics: _data });
        this._platform.debug('Calendar updated:', this._name);
      } else {
        this._platform.error('Error while updating calendar:', this._name);
      }
    } catch (error) {
      this._platform.error('Error while updating calendar:', this._name, error);
    }
  }

  getEvents(
    start: number | Date = new Date(),
    end: number | Date = new Date(),
  ): ICalendarEvent[] {
    const _rawEvents = this._buildEvents(start, end);

    if (_rawEvents) {
      const _events = this._getEvents(_rawEvents.events);
      const _occurrences = this._getOccurrences(_rawEvents.occurrences);
      const _allEvents = [..._events, ..._occurrences];

      this._platform.debug('Found Events:', this._name, _allEvents.length);

      return _allEvents;
    }

    return [];
  }

  private _buildEvents(
    start: number | Date = new Date(),
    end: number | Date = new Date(),
  ): ICalendarEventRaw | undefined {
    if (!this._calendar) {
      return;
    }

    return this._calendar.between(new Date(start), new Date(end)) as ICalendarEventRaw;
  }

  private _getEvents(rawEvents: ICalendarEventRawEvent[] = []): ICalendarEvent[] {
    return rawEvents.map(({ summary, startDate, endDate }) => {
      return {
        summary: summary,
        startDate: startDate.toJSDate(),
        endDate: endDate.toJSDate(),
      };
    });
  }

  private _getOccurrences(rawOccurrences: ICalendarEventRawOccurrence[] = []): ICalendarEvent[] {
    return rawOccurrences.map(({ item: { summary }, startDate, endDate }) => {
      return {
        summary: summary,
        startDate: startDate.toJSDate(),
        endDate: endDate.toJSDate(),
      };
    });
  }
}
