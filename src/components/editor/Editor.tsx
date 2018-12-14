import React, { useState, useEffect } from 'react';

import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import './Editor.css';
import initEditor from 'src/utils/editor/commands';
import { load } from 'src/database/content';
import VimStatusbar from './VimStatusbar';

const Editor: React.FunctionComponent = () => {
  const [code, setCode] = useState<string>(load());
  // editor reference
  const [editor, setEditor] = useState<
    monacoEditor.editor.IStandaloneCodeEditor
  >(null as any);

  function editorMounted(ed) {
    setEditor(ed);
    initEditor(ed);
  }

  return (
    <div className="editor">
      <MonacoEditor
        height={window.innerHeight - 18}
        language="typescript"
        theme="vs-dark"
        options={{
          fontSize: 15,
          fontFamily: 'monospace',
        }}
        value={code}
        onChange={setCode}
        editorDidMount={editorMounted}
      />
      <VimStatusbar editor={editor} />
    </div>
  );
};

export default Editor;
