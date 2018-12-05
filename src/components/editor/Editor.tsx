import React, { useState } from 'react';

import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';
import { initVimMode } from 'monaco-vim';

import './Editor.css';
import keybindings from 'src/utils/editor/keybindings';
import { load } from 'src/database/content';

const Editor: React.FunctionComponent = () => {
  const [code, setCode] = useState<string>(load());

  const initEditor: EditorDidMount = (editor) => {
    console.log('bar');
    initVimMode(editor, document.getElementById('vim-statusbar'));
    editor.focus();
    keybindings.forEach((k) => editor.addAction(k));
  };

  return (
    <div className="editor">
      <MonacoEditor
        height={window.outerHeight-40}
        language="typescript"
        theme="vs-dark"
        options={{
          fontSize: 16,
          fontFamily: 'monospace',
        }}
        value={code}
        onChange={setCode}
        editorDidMount={initEditor}
      />
      <div className="vim-statusbar" />
    </div>
  );
};

export default Editor;
