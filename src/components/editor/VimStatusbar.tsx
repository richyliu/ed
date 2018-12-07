import React, { useState } from 'react';

import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { initVimMode } from 'monaco-vim';

import './VimStatusbar.css';

interface VimStatusbarProps {
  editor?: monacoEditor.editor.IStandaloneCodeEditor;
}

const VimStatusbar: React.FunctionComponent<VimStatusbarProps> = ({
  editor,
}) => {
  // whether vim has been initialized
  const [vim, setVim] = useState<boolean>(false);

  // if vim hasn't been loaded yet and editor is ready
  if (!vim && editor) {
    setVim(true);
    initVimMode(editor, document.getElementsByClassName('vim-statusbar')[0]);

    // change vim mode html class on change
    const observer = new MutationObserver((mutations) => {
      const el = mutations[0].target as HTMLSpanElement;
      // get inner html (span element which indicates vim mode)
      switch (el.innerHTML) {
        // format according to vim mode
        case '--INSERT--':
          el.setAttribute('class', 'vim-statusbar__status--insert');
          break;
        case '--VISUAL--':
        case '--VISUAL LINE--':
          el.setAttribute('class', 'vim-statusbar__status--visual');
          break;
        case '--NORMAL--':
        default:
          el.setAttribute('class', 'vim-statusbar__status--normal');
      }
    });
    // observe on first span element
    const span = document.querySelector('.vim-statusbar>span:first-child');
    if (span) observer.observe(span, { subtree: true, childList: true });
  }

  return <div className="vim-statusbar" />;
};

export default VimStatusbar;
