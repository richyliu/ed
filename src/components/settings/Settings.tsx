/**
 * Allows the user to configure settings
 */
import React from 'react';

import './Settings.css';

const Settings: React.FunctionComponent = () => {
  const unregisterServiceWorkers = () => {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        reg.unregister();
        alert('Successfully unregistered service worker!');
      } else {
        alert('FAILED');
      }
    });
  };

  return (
    <div className="settings">
      <button className="settings__button" onClick={unregisterServiceWorkers}>
        Unregister service workers
      </button>
    </div>
  );
};

export default Settings;
