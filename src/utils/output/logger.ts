let _logs: any[] = [];

/**
 * Displays items and variables on the output
 * @param args Any number of arguments to log to logger
 */
export function log(...args) {
  _logs.push(...args);
}

/**
 * Get the logs currently available
 */
export function get(): any[] {
  return _logs;
}

/**
 * Clear the items in the log
 */
export function clear() {
  _logs = [];
}
