import React from 'react';

import './TabControlled.css';
import { Tab } from 'src/models/tab';

interface TabControlledProps {
  tabs: Tab[];
  active: Tab;
}

const TabControlled: React.FunctionComponent<TabControlledProps> = ({
  tabs,
  active,
}) => {
  return (
    <div className="tab-controlled">
      {tabs.map((tab, index) => tab == active && <tab.component key={index} />)}
    </div>
  );
};

export default TabControlled;
