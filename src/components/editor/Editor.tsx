import React, { useState, useEffect } from 'react';

import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { toast } from 'react-toastify';

import './Editor.css';
import initEditor from 'src/utils/editor/commands';
import { load } from 'src/database/content';
import VimStatusbar from './VimStatusbar';
import run from 'src/utils/editor/run';
import { switchTab } from 'src/utils/navigation/tabber';
import tabs from 'src/utils/navigation/tabs';
import { save } from 'src/database/content';

const Editor: React.FunctionComponent = () => {
  const [code, setCode] = useState<string>(load());
  // editor reference
  const [editor, setEditor] = useState<
    monacoEditor.editor.IStandaloneCodeEditor
  >(null as any);

  // input element for monaco editor
  const input = document.querySelector('.inputarea') as HTMLElement;
  useEffect(() => {
    const keydown = ((e: KeyboardEvent) => {
      if (e.key.match(/^(®|ß|¡)$/)) {
        // alt-r
        if (e.key == '®') {
          console.log('gonna run it');
          run(editor.getValue());
          // alt-s
        } else if (e.key == 'ß') {
          console.log('will save it (TODO)');
          toast.success('Formatted and saved!');
          save(editor.getValue());
          // alt-1
        } else if (e.key == '¡') {
          switchTab(tabs[0]);
        }
        e.preventDefault();
        // return false;
      }

      if (e.key.match(',')) {
        console.log('leader pressed!');
      }

      return;
    }) as EventListener;

    if (input) {
      input.addEventListener('keydown', keydown);
      return () => input.removeEventListener('keydown', keydown);
    }
    return () => {};
  });

  return (
    <div className="editor">
      <MonacoEditor
        // keyboard "done" bar is 44px, vim bar is 20px
        height={window.innerHeight - 64}
        language="typescript"
        theme="vs-dark"
        options={{
          fontSize: 15,
          fontFamily: 'monospace',
        }}
        value={code}
        onChange={setCode}
        editorDidMount={setEditor}
      />
      <VimStatusbar editor={editor} />
    </div>
  );
};

export default Editor;
