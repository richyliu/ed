import React from 'react';

import './Tabs.css';
import { Tab } from 'src/models/tab';
import { switchTab } from 'src/utils/navigation/tabber';

interface TabsProps {
  tabs: Tab[];
  active: Tab;
}

const Tabs: React.FunctionComponent<TabsProps> = ({ tabs, active }) => {
  return (
    <div className="tabs">
      {tabs.map((tab, index) => (
        <div
          className={'tabs__tab ' + (active === tab && 'tabs__tab--selected')}
          onClick={() => switchTab(tab)}
          key={index}
        >
          {tab.name}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
