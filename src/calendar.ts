import IcalExpander, {
  IcalExpanderEventRawDate,
  IcalExpanderEventRawEvent,
  IcalExpanderEventRawOccurrence,
} from 'ical-expander';
import { requestHelper } from './helpers/request.helper.js';
import { Logger } from 'homebridge';

export interface ICalendarEvent {
  summary: string;
  startDate: Date;
  endDate: Date;
}

export class Calendar {
  protected _name: string;
  protected _url: string;
  protected _calendar?: IcalExpander;
  protected _cache: Map<string, ICalendarEvent[]> = new Map();

  constructor(
    name: string,
    url: string,
    private readonly $_logger?: Logger,
  ) {
    this._name = name;
    this._url = url.replace('webcal://', 'https://');
  }

  now(): number {
    return this._roundDate(new Date()).getTime();
  }

  async update() {
    this.$_logger?.debug('Updating calendar:', this._name);
    try {
      const _data = await requestHelper(this._url);
      if (_data) {
        try {
          this._calendar = new IcalExpander({ ics: _data });
        } catch (error) {
          this.$_logger?.debug('Error while parsing calendar:', this._name, error);
          this.$_logger?.debug('Trying to fix calendar:', this._name);

          const _fixedData = _data
            .replace(/(\n)(^(\s)*(?![A-Z-]{3,}))/gm, '$1 $2')
            .replace(/( ){2,}/g, ' ');
          this._calendar = new IcalExpander({ ics: _fixedData });
        }

        this.$_logger?.debug('Calendar updated:', this._name);
      } else {
        this.$_logger?.error('Error while updating calendar:', this._name);
      }
    } catch (error) {
      this.$_logger?.error('Error while updating calendar:', this._name, error);
    }

    this.clearCache();
  }

  clearCache() {
    this.$_logger?.debug('Clearing cache:', this._name);
    this._cache.clear();
  }

  getEvents(
    start: number | Date = new Date(),
    end: number | Date = new Date(),
  ): ICalendarEvent[] {
    const _startDate = this._roundDate(new Date(start));
    const _endDate = this._roundDate(new Date(end));

    if (this._inCache(_startDate, _endDate)) {
      const _cachedEvents = this._getFromCache(_startDate, _endDate) || [];
      this.$_logger?.debug(
        `Found Events from ${_startDate.toISOString()} to ${_endDate.toISOString()} for ${this._name}:`,
        _cachedEvents.length,
      );
      return _cachedEvents;
    } else {
      const _rawEvents = this._buildEvents(_startDate, _endDate);

      if (_rawEvents) {
        const _events = this._getEvents(_rawEvents.events);
        const _occurrences = this._getOccurrences(_rawEvents.occurrences);
        const _allEvents = [..._events, ..._occurrences];

        this.$_logger?.debug(
          `Found Events from ${_startDate.toISOString()} to ${_endDate.toISOString()} for ${this._name}:`,
          _allEvents.length,
        );

        this._addToCache(_startDate, _endDate, _allEvents);
        return _allEvents;
      }

      this._addToCache(_startDate, _endDate, []);
      return [];
    }
  }

  private _buildEvents(
    start: Date,
    end: Date,
  ) {
    if (!this._calendar) {
      return;
    }

    return this._calendar.between(start, end);
  }

  private _getEvents(rawEvents: IcalExpanderEventRawEvent[] = []): ICalendarEvent[] {
    return rawEvents.map(({ summary, startDate, endDate }) => {
      return this._makeEvent(summary, startDate, endDate);
    });
  }

  private _getOccurrences(rawOccurrences: IcalExpanderEventRawOccurrence[] = []): ICalendarEvent[] {
    return rawOccurrences.map(({ item: { summary }, startDate, endDate }) => {
      return this._makeEvent(summary, startDate, endDate);
    });
  }

  private _makeEvent(
    summary: string,
    startDate: IcalExpanderEventRawDate,
    endDate: IcalExpanderEventRawDate,
  ): ICalendarEvent {
    return {
      summary: summary,
      startDate: new Date(startDate.toJSDate()),
      endDate: new Date(endDate.toJSDate()),
    };
  }

  private _roundDate(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    );
  }

  private _cacheKey(start: Date, end: Date): string {
    return `${start.toISOString()}-${end.toISOString()}`;
  }

  private _inCache(start: Date, end: Date): boolean {
    const _cacheKey = this._cacheKey(start, end);
    return this._cache.has(_cacheKey);
  }

  private _getFromCache(start: Date, end: Date): ICalendarEvent[] | undefined {
    const _cacheKey = this._cacheKey(start, end);
    this.$_logger?.debug('Getting from cache:', this._name, _cacheKey);
    return this._cache.get(_cacheKey);
  }

  private _addToCache(start: Date, end: Date, events: ICalendarEvent[]) {
    const _cacheKey = this._cacheKey(start, end);
    this.$_logger?.debug('Setting to cache:', this._name, _cacheKey);
    this._cache.set(_cacheKey, events);
  }
}
