import React from 'react';
import Header from '@/components/Header';
import FleetTracking from '@/components/FleetTracking';

const Fleet = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-12">
        <FleetTracking />
      </div>
    </div>
  );
};

export default Fleet;