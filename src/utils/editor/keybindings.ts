/**
 * Initializes important key bindings for the editor and tab switching
 */
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import run from 'src/utils/editor/run';
import { switchTab } from 'src/utils/navigation/tabber';
import { save } from 'src/database/content';

/*
 * Remap vim keys with ctrl because some don't work by default
 */
// document.onkeyup = e => {
document.addEventListener('keyup', ((e: KeyboardEvent) => {
  // ctrl-c and ctrl-h are sent as "enter" and "backspace" but with meta key
  if (
    e.code === 'Unidentified' &&
    e.metaKey &&
    (e.key === 'Enter' || e.key === 'Backspace')
  ) {
    console.log('sending');
    // send just escape for ctrl-c
    vimKey('Escape');
    if (e.key === 'Backspace') {
      // add "x" and "i" to simulate a backspace
      vimKey('x');
      vimKey('i');
    }
    // do not propagate event
    return false;
  }
  return;
}) as EventListener);

// show hover "exploit"
// document.querySelector('.monaco-editor').dispatchEvent(new MouseEvent('mousemove', { clientX: 196, clientY: 12 }));
// WORKS WITHOUT ANY HACKS!!! YAY!!!
// document.querySelector('.mtk1').dispatchEvent(new MouseEvent('mousemove', { clientX: 196, clientY: 12, bubbles: true}));
// ^^ notice selector is .mtk1, which is a span and bubbles is true

/*
 * Map alt-hjkl movement keys for monaco vim in insert mode and other keys
 */
document.addEventListener('onkeydown', ((e: KeyboardEvent) => {
  // if key is alt-hjkl (weird chars get created by alt key)
  if (e.key.match(/^(˙|∆|˚|¬)$/)) {
    vimKey('Escape');
    // h key
    if (e.key === '˙') {
      vimKey('i');
      // j
    } else if (e.key === '∆') {
      vimKey('j');
      vimKey('a');
      // k
    } else if (e.key === '˚') {
      vimKey('k');
      vimKey('a');
      // has to be l
    } else {
      vimKey('l');
      vimKey('a');
    }
    // prevent event propagation
    return false;
  }

  return;
}) as EventListener);

/**
 * Passes a key to Monaco Vim
 * @param key   Single char key to pass
 */
function vimKey(key: string) {
  const input = document.querySelector('.inputarea');
  const keyCode = key === 'Escape' ? 27 : 0;

  if (input) {
    const keyEv = { key, keyCode } as KeyboardEventInit;
    // dispatch event to vim input
    input.dispatchEvent(new KeyboardEvent('keydown', keyEv));
  }
}

/**
 * Binds meta-anything shortcut to a certain action
 * @param input   Text area to bind listeners to
 * @param editor  Monaco editor instance
 * @returns       Function that unbinds listeners
 */
export function bindMetaKeys(
  input: HTMLTextAreaElement,
  editor: monacoEditor.editor.IStandaloneCodeEditor
): () => void {
  const keydown = ((e: KeyboardEvent) => {
    // not ascii character, has to be alt-anything code
    if (e.key.charCodeAt(0) > 128) {
      // get cursor location
      let curLeft = 0;
      let curTop = 0;
      let node = input as HTMLElement;
      while (true) {
        curLeft += node.offsetLeft;
        curTop += node.offsetTop;
        if (node.offsetParent) {
          node = node.offsetParent as HTMLElement;
        } else {
          break;
        }
      }

      switch (e.key) {
        case '®':
          // alt-r: Run code
          run(editor.getValue());
          break;
        case 'ß':
          // alt-s: Save code
          save(editor.getValue());
          break;
        case '†':
          // alt-t: Open help or info for symbol (equal to hovering)
          // add 11 to move away from cursor (so cursor div isn't selected by elementFromPoint)
          const cursorLine = document.elementFromPoint(curLeft + 11, curTop);
          if (cursorLine && cursorLine.children.length > 0) {
            const span = cursorLine.children[0] as HTMLSpanElement;

            // simulate mouse hover
            span.dispatchEvent(
              new MouseEvent('mousemove', {
                clientX: curLeft,
                clientY: curTop,
                bubbles: true,
              })
            );
          }
          break;
        case 'ƒ':
          // alt-f: Format code
          editor.getAction('editor.action.formatDocument').run();
          break;
        case 'π':
          // alt-p: command palette
          editor.getAction('editor.action.quickCommand').run();
        case '¡':
          // alt-1: Switch to tab 1
          switchTab(0);
          break;
        case '™':
          // alt-2: Switch to tab 2
          switchTab(1);
          break;
      }
      e.preventDefault();
    }
  }) as EventListener;

  input.addEventListener('keydown', keydown);
  return () => input.removeEventListener('keydown', keydown);
}
