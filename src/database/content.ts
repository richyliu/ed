/**
 * Save and load content for the editor
 */

const defaultLocation = '_default';

export function save(str: string, loc = defaultLocation) {
  localStorage.setItem(loc, str);
}

export function load(loc = defaultLocation): string {
  return localStorage.getItem(loc) || '';
}
