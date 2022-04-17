import { Logger } from 'homebridge';
import IcalExpander from 'ical-expander';
import { requestHelper } from './helpers/request.helper';

export interface ICalendarEvent {
  summary: string;
  startDate: Date;
  endDate: Date;
}

export class Calendar {
  protected _logger: Logger;

  protected _name: string;
  protected _url: string;
  protected _calendar: IcalExpander;

  constructor (name: string, url: string, logger: Logger) {
    this._name = name;
    this._url = url.replace('webcal://', 'https://');
    this._logger = logger;
  }

  async update () {
    this._logger.info('Updating calendar:', this._name);
    try {
      const _data = await requestHelper(this._url);
      if (_data) {
        this._calendar = new IcalExpander({ ics: _data });
      } else {
        this._logger.error('Error while updating calendar:', this._name);
      }
    }
    catch (error: any) {
      this._logger.error('Error while updating calendar:', this._name, error);
    }
  }

  getEvents (): ICalendarEvent[] {
    const _rawEvents = this._buildEvents();

    const _events = this._getEvents(_rawEvents.events);
    const _occurrences = this._getOccurrences(_rawEvents.occurrences);

    return [..._events, ..._occurrences];
  }

  private _buildEvents () {
    if (!this._calendar) {
      return;
    }

    const now = new Date();
    return this._calendar.between(now, now);
  }

  private _getEvents (rawEvents: any[] = []): ICalendarEvent[] {
    return rawEvents.map(({ summary, startDate, endDate }) => {
      return {
        summary: summary,
        startDate: startDate.toJSDate(),
        endDate: endDate.toJSDate(),
      };
    });
  }

  private _getOccurrences (rawOccurrences: any[] = []): ICalendarEvent[] {
    return rawOccurrences.map(({ item: { summary }, startDate, endDate }) => {
      return {
        summary: summary,
        startDate: startDate.toJSDate(),
        endDate: endDate.toJSDate(),
      };
    });
  }
}
