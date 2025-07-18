import { LongIntervalJob, SimpleIntervalJob, SimpleIntervalSchedule, Task } from 'toad-scheduler';
import { isLongJobIntervalHelper } from './isLongJobInterval.helper.js';

export function createJobHelper(
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
    { id },
  );
}
