/**
 * Manages the changing of tabs and windows
 */
import { Tab } from 'src/models/tab';
import tabs from 'src/utils/navigation/tabs';

type TabListener = (tab: Tab) => void;

const listeners: TabListener[] = [];

/**
 * Add a listener to listen to tab change events. Returns function that can be
 * called to remove the listener
 * @param listener To listen to tab change events
 */
export function addTabListener(listener: TabListener): () => void {
  listeners.push(listener);

  return () => removeTabListener(listener);
}

export function removeTabListener(listener: TabListener) {
  listeners.filter(l => l !== listener);
}

export function switchTab(newTab: Tab | number) {
  if (typeof newTab === 'number') {
    switchTab(tabs[newTab]);
  } else {
    listeners.forEach(l => l(newTab));
  }
}
