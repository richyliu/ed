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
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={
            'tab-controlled__item ' +
            (tab !== active && 'tab-controlled__item--hidden')
          }
        >
          <tab.component />
        </div>
      ))}
    </div>
  );
};

export default TabControlled;
