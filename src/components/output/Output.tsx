/**
 * Displays output from the logger
 */
import React, { useEffect } from 'react';

import './Output.css';
import * as Logger from 'src/utils/output/logger';
import LogItem from './LogItem';

const Output: React.FunctionComponent = () => {
  return (
    <div className="output">
      {Logger.get().map((item, index) => (
        <LogItem key={index} data={item}/>
      ))}
    </div>
  );
};

export default Output;
