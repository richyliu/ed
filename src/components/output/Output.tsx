/**
 * Displays output from the logger
 */
import React, { useEffect } from 'react';

import './Output.css';
import * as Logger from 'src/utils/output/logger';
import { switchTab } from 'src/utils/navigation/tabber';
import tabs from 'src/utils/navigation/tabs';

const Output: React.FunctionComponent = () => {
  return (
    <div className="output">
      {Logger.get().map((item, index) => (
        <p key={index}>{JSON.stringify(item)}</p>
      ))}
    </div>
  );
};

export default Output;
