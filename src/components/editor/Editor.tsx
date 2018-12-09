import React, { useState, useRef } from 'react';

import AceAjax, { acequire } from 'brace';
import AceEditor from 'react-ace';
import 'brace/ext/language_tools';
import 'brace/ext/beautify';
import 'brace/mode/typescript';
import 'brace/theme/monokai';
import 'brace/keybinding/vim';

import { toast } from 'react-toastify';
import * as prettier from 'prettier/standalone';
import * as parserTypescript from 'prettier/parser-typescript';

import { save } from 'src/database/content';
import run from 'src/utils/editor/run';
import './Editor.css';
import { load } from 'src/database/content';
import runLint from 'src/utils/editor/linter';

const Editor: React.FunctionComponent = () => {
  const [value, setValue] = useState<string>(load());
  const editorRef = useRef<AceEditor>(null);

  // wrapps a function with the ace editor from editorRef
  const withEditor: ((
    func: (editor: AceAjax.Editor) => any
  ) => () => void) = (func) => () => {
    const curEditor = editorRef.current as any;
    if (curEditor) {
      func(curEditor.editor);
    } else {
      console.warn('Ace Editor is not defined!');
    }
  };

  // focus editor if not focused
  withEditor((editor) => {
    // Ace typedefs say isFocused is void for some reason?
    if (!(editor.isFocused as () => boolean)()) {
      editor.focus();
    }
  })();

  const commands = [
    {
      name: 'save',
      bindKey: { win: 'Alt-s', mac: 'Alt-s' },
      exec: withEditor((editor) => {
        toast.success('Saved!');
        save(editor.getValue());
      }),
    },
    {
      name: 'run',
      bindKey: { win: 'Alt-r', mac: 'Alt-r' },
      exec: withEditor((editor) => {
        run(editor.getValue());
      }),
    },
    {
      name: 'beautify',
      bindKey: { win: 'Alt-i', mac: 'Alt-i' },
      exec: withEditor((editor) => {
        editor.setValue(
          prettier.format(editor.getValue(), {
            parser: 'typescript',
            plugins: [parserTypescript],
          })
        );
        editor.clearSelection();
      }),
    },
    {
      name: 'lint',
      bindKey: { win: 'Alt-l', mac: 'Alt-l' },
      exec: withEditor((editor) => {
        runLint(editor.getValue()).then((lints) =>
          lints.failures.forEach((lint) => {
            console.log(lint);
            editor.getSession().setAnnotations([
              {
                row: 1,
                column: 0,
                text: 'error message',
                type: 'warning',
              },
            ]);
          })
        );
      }),
    },
  ];

  return (
    <AceEditor
      mode="typescript"
      theme="monokai"
      onChange={setValue}
      value={value}
      name="main_editor_1"
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
      }}
      keyboardHandler="vim"
      width="100%"
      fontSize={15}
      tabSize={2}
      commands={commands}
      ref={editorRef}
    />
  );
};

export default Editor;
