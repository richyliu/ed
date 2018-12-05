import React, { useState } from 'react';

import './Base.css';
import Tabs from 'src/components/navigation/Tabs';
import TabControlled from 'src/components/navigation/TabControlled';
import Editor from './editor/Editor';
import Output from './output/Output';
import { Tab } from 'src/models/tab';

const tabs: Tab[] = [
  {
    name: 'E',
    component: Editor,
  },
  {
    name: 'O',
    component: Output,
  },
];

const Base: React.FunctionComponent = () => {
  // index of active tab
  const [active, setActive] = useState<number>(0);

  return (
    <div className="container">
      <Tabs tabs={tabs} onChange={setActive} active={active} />
      <TabControlled component={tabs[active].component} />
    </div>
  );
};

export default Base;
