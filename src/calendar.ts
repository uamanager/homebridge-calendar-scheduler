import IcalExpander from 'ical-expander';
import { requestHelper } from './helpers/request.helper';
import { Logger } from 'homebridge';

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
  protected _name: string;
  protected _url: string;
  protected _calendar: IcalExpander;
  protected _cache: Map<string, ICalendarEventRaw> = new Map();

  constructor(
    name: string,
    url: string,
    private readonly $_logger?: Logger,
  ) {
    this._name = name;
    this._url = url.replace('webcal://', 'https://');
  }

  async update() {
    this.$_logger && this.$_logger.debug('Updating calendar:', this._name);
    try {
      const _data = await requestHelper(this._url);
      if (_data) {
        try {
          this._calendar = new IcalExpander({ ics: _data });
        } catch (error) {
          this.$_logger && this.$_logger.debug('Error while parsing calendar:', this._name, error);
          this.$_logger && this.$_logger.debug('Trying to fix calendar:', this._name);

          const _fixedData = _data
            .replace(/(\n)(^(\s)*(?![A-Z-]{3,}))/gm, '$1 $2')
            .replace(/( ){2,}/g, ' ');
          this._calendar = new IcalExpander({ ics: _fixedData });
        }

        this.$_logger && this.$_logger.debug('Calendar updated:', this._name);
      } else {
        this.$_logger && this.$_logger.error('Error while updating calendar:', this._name);
      }
    } catch (error) {
      this.$_logger && this.$_logger.error('Error while updating calendar:', this._name, error);
    }
  }

  clearCache() {
    this.$_logger && this.$_logger.debug('Clearing cache:', this._name);
    this._cache.clear();
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

      this.$_logger && this.$_logger.debug('Found Events:', this._name, _allEvents.length);

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

    const _startDate = new Date(start);
    const _endDate = new Date(end);

    if (this._inCache(_startDate, _endDate)) {
      return this._getFromCache(_startDate, _endDate);
    } else {
      const _rawEvents = this._calendar.between(_startDate, _endDate) as ICalendarEventRaw;
      this._addToCache(_startDate, _endDate, _rawEvents);
      return _rawEvents;
    }
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

  private _cacheKey(start: Date, end: Date): string {
    return `${start.getTime()}-${end.getTime()}`;
  }

  private _inCache(start: Date, end: Date): boolean {
    const _cacheKey = this._cacheKey(start, end);
    return this._cache.has(_cacheKey);
  }

  private _getFromCache(start: Date, end: Date): ICalendarEventRaw | undefined {
    this.$_logger && this.$_logger.debug('Getting from cache:', this._name);
    const _cacheKey = this._cacheKey(start, end);
    return this._cache.get(_cacheKey);
  }

  private _addToCache(start: Date, end: Date, rawEvents: ICalendarEventRaw) {
    const _cacheKey = this._cacheKey(start, end);
    this._cache.set(_cacheKey, rawEvents);
  }
}
