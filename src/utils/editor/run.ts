import { toast } from 'react-toastify';

import { switchTab } from '../navigation/tabber';
import tabs from '../navigation/tabs';
import * as Logger from '../output/logger';

function setup() {
  // @ts-ignore
  window.__consolelog = window.console.log;
  Logger.clear();
}

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

  // rebind console logs to output logger
  window.console.log = Logger.log;

  try {
    eval.call(window, ts.transpile(code));
  } catch (e) {
    console.error(e);
    toast.error('Runtime error: ' + e.message);
  }

  teardown();

  switchTab(tabs[1]);
}
