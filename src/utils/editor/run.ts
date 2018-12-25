import { toast } from 'react-toastify';

import * as Logger from '../output/logger';

const __TESTING_LIB = `
let failed = [], passed = 0, total = 0, _curGroupName = '';

function test(tests: { [key: string]: () => void }) {
  Object.keys(tests).forEach(key => {
    _curGroupName = key;
    tests[key]();
  });
  console.log({ passed, failed: failed.length, total });
  console.log(failed);
}
function __equal(a, b) {
  if (a === b) return true;
  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (const prop in a) if (!__equal(a[prop], b[prop])) return false;
    return true;
  }
}
function is<T>(a: T, b: T) {
  total++;
  if (__equal(a, b)) {
    passed++;
  } else {
    failed.push({ group: _curGroupName, a, b });
  }
}
`;

/**
 * Bind console log to Logger
 */
function setup() {
  // @ts-ignore
  window.__consolelog = window.console.log;
  Logger.clear();
  window.console.log = Logger.log;
}

/**
 * Unbind console log from Logger
 */
function teardown() {
  // @ts-ignore
  window.console.log = window.__consolelog;
}

/**
 * Run typescript code and display the output
 * @param code  To be executed
 */
export default function(code: string) {
  setup();

  // add testing lib
  const runCode = __TESTING_LIB + code;

  try {
    eval.call(window, ts.transpile(runCode));
  } catch (e) {
    console.error(e);
    toast.error('Runtime error: ' + e.message);
  }

  teardown();
}
