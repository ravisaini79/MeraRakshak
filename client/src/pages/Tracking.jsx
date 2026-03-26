import React from 'react';
import Dashboard from './Dashboard';

const Tracking = () => {
  // We reuse the Dashboard tracking logic for simplicity or redirect/embed it here specifically focusing on map
  return (
    <div className="h-[calc(100vh-140px)]">
      <Dashboard />
    </div>
  );
};

export default Tracking;
