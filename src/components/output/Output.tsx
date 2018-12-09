import React, { useEffect } from 'react';

import './Output.css';
import * as Logger from 'src/utils/output/logger';
import { switchTab } from 'src/utils/navigation/tabber';
import tabs from 'src/utils/navigation/tabs';
import * as Key from 'src/utils/keylistener';

const Output: React.FunctionComponent = () => {
  useEffect(() => Key.addListener('r', () => switchTab(tabs[0]), true));

  return (
    <div className="output">
      {Logger.get().map((item, index) => (
        <p key={index}>{JSON.stringify(item)}</p>
      ))}
    </div>
  );
};

export default Output;
