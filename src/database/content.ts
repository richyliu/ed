/**
 * Save and load content for the editor
 */

export function save(str: string, loc = 'default') {
  localStorage.setItem(loc, str);
}

export function load(loc = 'default'): string {
  return localStorage.getItem(loc) || 'function foo() {return 2;}';
}
