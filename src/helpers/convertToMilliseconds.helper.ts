export function convertToMillisecondsHelper (
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
): number {
  return milliseconds + 1000 * (seconds + 60 * (minutes + 60 * (hours + 24 * days)));
}
