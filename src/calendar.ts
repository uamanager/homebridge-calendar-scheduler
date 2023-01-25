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
