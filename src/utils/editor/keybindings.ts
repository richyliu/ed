/**
 * Initializes important key bindings for the editor and tab switching
 */
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import prettier from 'prettier/standalone';
import typescript from 'prettier/parser-typescript';

import run from 'src/utils/editor/run';
import { switchTab } from 'src/utils/navigation/tabber';
import { save } from 'src/database/content';

const prettierOptions = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 40,
};

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
    // send just escape for ctrl-c
    vimKey('Escape');
    if (e.key === 'Backspace') {
      // simulate a backspace
      vimKey('x');
      vimKey('a');
      e.preventDefault();
    }
    // do not propagate event
    return false;
  }
  return;
}) as EventListener);

/**
 * Passes a key to Monaco Vim
 * @param key       Single char key to pass
 * @param customOpt Options for keyevent
 */
function vimKey(key: string, customOpt?: any) {
  const input = document.querySelector('.inputarea');
  const keyCode = key === 'Escape' ? 27 : 0;

  if (input) {
    const keyEv = customOpt || ({ key, keyCode } as KeyboardEventInit);
    // dispatch event to vim input
    input.dispatchEvent(new KeyboardEvent('keydown', keyEv));
  }
}

/**
 * Passes a key to the Monaco editor (inserts the character)
 * @param key     Single char key to pass
 * @param editor  Editor instance
 */
function monacoKey(
  key: string,
  editor: monacoEditor.editor.IStandaloneCodeEditor
) {
  const selection = editor.getSelection();
  if (selection) {
    const range = new monacoEditor.Range(
      selection.startLineNumber,
      selection.startColumn,
      selection.endLineNumber,
      selection.endColumn
    );
    editor.executeEdits('custom-key-insert', [
      {
        range,
        text: key,
        forceMoveMarkers: true,
      },
    ]);
  }
}

/**
 * Get the position of the nth newline in a string
 * @param str To search from
 * @param n   Nth newline
 */
function nthNewline(str: string, n: number): number {
  let index = -1;
  const substring = '\n';

  while (n-- && index++ < str.length) {
    index = str.indexOf(substring, index);
    if (index < 0) break;
  }
  return index;
}

/**
 * Convert an offset in a str to line number and column based on newlines
 * @param str    To search from
 * @param offset To convert to line number and column
 */
function getLineColumn(
  str: string,
  offset: number
): { lineNumber: number; column: number } {
  // find number of newlines + 1 up to offset
  const lineNumber =
    (str.substring(0, offset).match(new RegExp('\n', 'g')) || []).length + 1;
  // find the difference between the offset and position of previous
  const column = offset - nthNewline('\n' + str, lineNumber) + 1;

  return {
    lineNumber,
    column,
  };
}

/**
 * Format the entire code
 */
function formatCode(editor: monacoEditor.editor.IStandaloneCodeEditor) {
  // get position of cursor
  const pos = editor.getPosition() || new monacoEditor.Position(0, 0);
  // get current value
  const val = editor.getValue();
  // calculate the offset for prettier
  const cursorOffset = nthNewline('\n' + val, pos.lineNumber) + pos.column - 1;

  // format the code using prettier
  const out = prettier.formatWithCursor(val, {
    cursorOffset,
    parser: 'typescript',
    plugins: [typescript],
    ...prettierOptions,
  });

  const model = editor.getModel();
  // get line and column from offset
  const { lineNumber, column } = getLineColumn(out.formatted, out.cursorOffset);

  if (model) {
    // execute edit so it gets saved in "undo" history
    editor.executeEdits(
      // "source" string, not sure what it does
      '',
      [
        {
          // replace this range (entire document)
          range: new monacoEditor.Range(
            0,
            0,
            model.getLineCount(),
            model.getLineLength(model.getLineCount())
          ),
          // with the formatted text
          text: out.formatted,
        },
      ],
      // replace the cursor to the lineNumber and column
      [new monacoEditor.Selection(lineNumber, column, lineNumber, column)]
    );
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

      e.preventDefault();
      switch (e.key) {
        case '®':
          // alt-r: Redo (same as ctrl-r)
          vimKey('r', {
            ctrlKey: true,
            keyCode: 82,
          });
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
          // alt-f: Format code using Prettier
          formatCode(editor);
          break;
        case 'π':
          // alt-p: command palette
          editor.getAction('editor.action.quickCommand').run();
        case '¡':
          // alt-1: Switch to tab 1
          switchTab(0);
          break;
        case '™':
          // alt-2: Switch to tab 2 and run
          run(editor.getValue());
          switchTab(1);
          break;
        case '£':
          // alt-3: Switch to tab 3
          switchTab(2);
          break;
      }
    } else {
      // normal keys
      switch (e.key) {
        case "'":
        case '"':
          // fix fancy quotes
          if (e.keyCode === 222) {
            monacoKey(e.key, editor);
            e.preventDefault();
          }
          break;
      }
    }
  }) as EventListener;

  input.addEventListener('keydown', keydown);
  return () => input.removeEventListener('keydown', keydown);
}
