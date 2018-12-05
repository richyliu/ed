import React from 'react';

import './Tabs.css';
import { Tab } from 'src/models/tab';

interface TabsProps {
  tabs: Tab[];
  onChange: (active: number) => void;
  active: number;
}

const Tabs: React.FunctionComponent<TabsProps> = ({
  tabs,
  onChange,
  active,
}) => {
  return (
    <div className="tabs">
      {tabs.map((tab, index) => (
        <div
          className={'tabs__tab ' + (active == index && 'tabs__tab--selected')}
          onClick={() => onChange(index)}
          key={index}
        >
          {tab.name}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
