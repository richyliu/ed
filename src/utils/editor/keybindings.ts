import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import { save } from 'src/database/content';
import run from './run';

export default [
  {
    id: 'ed-save',
    label: 'Save',
    keybindings: [monacoEditor.KeyMod.CtrlCmd | monacoEditor.KeyCode.KEY_S],
    run: (ed) => {
      console.log('saving...');
      save(ed.getValue());
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
];
