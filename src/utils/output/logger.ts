let _log: any[] = [];

/**
 * Displays items and variables on the output
 * @param args Any number of arguments to log to logger
 */
export function log(...args) {
  _log.push(...args);
}

/**
 * Get the logs currently available
 */
export function get(): any[] {
  return _log;
}

/**
 * Clear the items in the log
 */
export function clear() {
  _log = [];
}