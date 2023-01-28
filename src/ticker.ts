import { ToadScheduler } from 'toad-scheduler';
import { Logger } from 'homebridge';
import { Job } from './job.manager';
import { EventEmitter } from 'events';

export class Ticker {
  private _tickerJob: Job;
  private _emitter: EventEmitter;

  constructor(
    private readonly $_scheduler: ToadScheduler,
    private readonly $_logger?: Logger,
  ) {
    this._tickerJob = new Job(
      'ticker',
      { minutes: 1, runImmediately: true },
      this.tick.bind(this),
      this.$_scheduler,
    );
    this._emitter = new EventEmitter();
    this.$_logger && this.$_logger.debug('Finished initializing ticker');
  }

  attach(listener: () => void) {
    this._emitter.on('tick', listener);

    this.$_logger && this.$_logger.debug('Attached listener to ticker');
  }

  detach(listener: () => void) {
    this._emitter.removeListener('tick', listener);

    this.$_logger && this.$_logger.debug('Detached listener from ticker');
  }

  tick() {
    this._emitter.emit('tick');
  }

  start() {
    this._tickerJob.start();
  }

  stop() {
    this._tickerJob.stop();
  }
}
