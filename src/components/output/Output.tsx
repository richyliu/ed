import React, { useEffect } from 'react';

import './Output.css';
import * as Logger from 'src/utils/output/logger';
import { switchTab } from 'src/utils/navigation/tabber';
import tabs from 'src/utils/navigation/tabs';

const Output: React.FunctionComponent = () => {
  function keyListener(e) {
    // switch to editor tab on enter
    if (e.key == 'Enter') {
      switchTab(tabs[0]);
    }
  }

  useEffect(() => {
    document.addEventListener('keypress', keyListener);
    return () => document.removeEventListener('keypress', keyListener);
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
