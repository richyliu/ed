import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { initVimMode } from 'monaco-vim';
import { toast } from 'react-toastify';

import { save } from 'src/database/content';
import run from './run';

export default function(editor: monacoEditor.editor.IStandaloneCodeEditor) {
  editor.focus();
  initVimMode(editor, document.getElementById('vim-statusbar'));

  [
    {
      id: 'ed-save',
      label: 'Save',
      keybindings: [monacoEditor.KeyMod.CtrlCmd | monacoEditor.KeyCode.KEY_S],
      run: (ed) => {
        editor.getAction('editor.action.formatDocument').run();
        toast.success('Formatted and saved!');
      },
    },
    {
      id: 'ed-run',
      label: 'Run',
      keybindings: [monacoEditor.KeyMod.CtrlCmd | monacoEditor.KeyCode.Enter],
      run: (ed) => {
        run(ed.getValue());
      },
    },
  ].forEach((a) => editor.addAction(a));
}
