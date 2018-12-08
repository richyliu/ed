import React, { useEffect } from 'react';

import './Output.css';
import * as Logger from 'src/utils/output/logger';
import { switchTab } from 'src/utils/navigation/tabber';
import tabs from 'src/utils/navigation/tabs';

const Output: React.FunctionComponent = () => {
  function keyListener(e: KeyboardEvent) {
    // switch to editor tab on enter
    if (e.key == 'r') {
      switchTab(tabs[0]);
    }
  }

  useEffect(() => {
    document.addEventListener('keypress', keyListener);
    () => document.removeEventListener('keypress', keyListener);
  });

  return (
    <div className="output">
      {Logger.get().map((item, index) => (
        <p key={index}>{JSON.stringify(item)}</p>
      ))}
    </div>
  );
};

export default Output;
