/**
 * Creates and runs editor instance to allow user to modify code
 */
import React, { useState, useEffect } from 'react';

import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import './Editor.css';
import { load } from 'src/database/content';
import VimStatusbar from './VimStatusbar';
import { bindMetaKeys } from 'src/utils/editor/keybindings';

const Editor: React.FunctionComponent = () => {
  const [code, setCode] = useState<string>(load());
  // editor reference
  const [editor, setEditor] = useState<
    monacoEditor.editor.IStandaloneCodeEditor
  >(null as any);

  // input element for monaco editor
  const input = document.querySelector('.inputarea') as HTMLTextAreaElement;
  useEffect(() => input && bindMetaKeys(input, editor));

  function initEditor(editor) {
    setEditor(editor);
    editor.getModel().updateOptions({ tabSize: 2 });
  }

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
        editorDidMount={initEditor}
      />
      <VimStatusbar editor={editor} />
    </div>
  );
};

export default Editor;
