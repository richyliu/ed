import React, { useState } from 'react';

import MonacoEditor from 'react-monaco-editor';

import './Editor.css';
import initEditor from 'src/utils/editor/commands';
import { load } from 'src/database/content';

const Editor: React.FunctionComponent = () => {
  const [code, setCode] = useState<string>(load());

  return (
    <div className="editor">
      <MonacoEditor
        height={window.outerHeight - 18}
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
      <div id="vim-statusbar" />
    </div>
  );
};

export default Editor;
