import { LongIntervalJob, SimpleIntervalJob, Task } from 'toad-scheduler';
import {
  SimpleIntervalSchedule,
} from 'toad-scheduler/dist/lib/engines/simple-interval/SimpleIntervalSchedule';
import { isLongJobIntervalHelper } from './isLongJobInterval.helper';

export function createJobHelper (
  id: string,
  config: SimpleIntervalSchedule,
  task: Task,
): SimpleIntervalJob | LongIntervalJob {
  const _isLong = isLongJobIntervalHelper(
    config.days,
    config.hours,
    config.minutes,
    config.seconds,
    config.milliseconds,
  );

  return new (_isLong ? LongIntervalJob : SimpleIntervalJob)(
    config,
    task,
    id,
  );
}
