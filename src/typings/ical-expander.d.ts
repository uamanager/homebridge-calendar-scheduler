declare module 'ical-expander' {
  export interface IcalExpanderOpts {
    ics: string;
    maxIterations?: number;
    skipInvalidDates?: boolean;
  }

  export default class IcalExpander {
    constructor(opts: IcalExpanderOpts);

    between(after?: Date, before?: Date): IcalExpanderEventRaw;

    before(before: Date): IcalExpanderEventRaw;

    after(after: Date): IcalExpanderEventRaw;

    all(): IcalExpanderEventRaw;
  }

  export interface IcalExpanderEventRaw {
    events: IcalExpanderEventRawEvent[];
    occurrences: IcalExpanderEventRawOccurrence[];
  }

  export interface IcalExpanderEventRawEvent {
    summary: string;
    startDate: IcalExpanderEventRawDate;
    endDate: IcalExpanderEventRawDate;
  }

  export interface IcalExpanderEventRawOccurrence {
    item: {
      summary: string;
    };
    startDate: IcalExpanderEventRawDate;
    endDate: IcalExpanderEventRawDate;
  }

  export interface IcalExpanderEventRawDate {
    toJSDate: () => Date;
  }
}
