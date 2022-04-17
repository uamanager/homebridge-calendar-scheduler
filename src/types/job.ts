import { LongIntervalJob, SimpleIntervalJob, Task, ToadScheduler } from 'toad-scheduler';
import {
  SimpleIntervalSchedule,
} from 'toad-scheduler/dist/lib/engines/simple-interval/SimpleIntervalSchedule';
import { createJobHelper } from '../helpers/createJob.helper';

export class Job {
  constructor (
    public id: string,
    protected _config: SimpleIntervalSchedule,
    protected _handler: () => void,
    protected $_scheduler: ToadScheduler,
  ) {}

  getTaskId (): string {
    return `task-${this.id}`;
  }

  getJobId (): string {
    return `job-${this.id}`;
  }

  createTask (handler: () => void = this._handler): Task {
    return new Task(this.getTaskId(), handler);
  }

  createJob (
    config: SimpleIntervalSchedule = this._config,
    handler: () => void = this._handler,
  ): SimpleIntervalJob | LongIntervalJob {
    return createJobHelper(this.getJobId(), config, this.createTask(handler));
  }

  start () {
    this.$_scheduler.addIntervalJob(this.createJob());
  }

  stop () {
    this.$_scheduler.removeById(this.getJobId());
  }

  restart () {
    this.stop();
    this.start();
  }
}
