import React from 'react';

import './TabControlled.css';

interface TabControlledProps {
  component: React.FunctionComponent;
}

const TabControlled: React.FunctionComponent<TabControlledProps> = ({
  component: Component,
}) => {
  return (
    <div className="tab-controlled">
      <Component />
    </div>
  );
};

export default TabControlled;
