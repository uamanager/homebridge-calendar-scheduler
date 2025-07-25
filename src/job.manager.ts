import {
  LongIntervalJob,
  SimpleIntervalJob,
  SimpleIntervalSchedule,
  Task,
  ToadScheduler,
} from 'toad-scheduler';
import { createJobHelper } from './helpers/createJob.helper.js';

export class Job {
  constructor(
    public id: string,
    protected _config: SimpleIntervalSchedule,
    protected _handler: () => void = () => undefined,
    protected $_scheduler: ToadScheduler,
  ) {
  }

  getTaskId(): string {
    return `task-${this.id}`;
  }

  getJobId(): string {
    return `job-${this.id}`;
  }

  createTask(handler: () => void = this._handler): Task {
    return new Task(this.getTaskId(), handler);
  }

  createJob(
    config: SimpleIntervalSchedule = this._config,
    handler: () => void = this._handler,
  ): SimpleIntervalJob | LongIntervalJob {
    return createJobHelper(this.getJobId(), config, this.createTask(handler));
  }

  start() {
    this.$_scheduler.addIntervalJob(this.createJob());
  }

  stop() {
    this.$_scheduler.removeById(this.getJobId());
  }

  restart() {
    this.stop();
    this.start();
  }
}
