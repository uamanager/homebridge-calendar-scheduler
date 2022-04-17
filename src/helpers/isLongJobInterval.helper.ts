import { convertToMillisecondsHelper } from './convertToMilliseconds.helper';

export const LONG_JOB_INTERVAL = convertToMillisecondsHelper(28.45);

export function isLongJobIntervalHelper (
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
): boolean {
  return convertToMillisecondsHelper(
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  ) > LONG_JOB_INTERVAL;
}
