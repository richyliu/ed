import React, { useState, useEffect } from 'react';

import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';

import './Base.css';
import Tabs from 'src/components/navigation/Tabs';
import TabControlled from 'src/components/navigation/TabControlled';
import { Tab } from 'src/models/tab';
import { addTabListener } from 'src/utils/navigation/tabber';
import tabs from 'src/utils/navigation/tabs';

const Base: React.FunctionComponent = () => {
  // index of active tab
  const [active, setActive] = useState<Tab>(tabs[0]);

  useEffect(() => addTabListener(setActive), [setActive]);

  return (
    <div className="container">
      <ToastContainer autoClose={3000} />
      <Tabs tabs={tabs} active={active} />
      <TabControlled tabs={tabs} active={active} />
    </div>
  );
};

export default Base;
