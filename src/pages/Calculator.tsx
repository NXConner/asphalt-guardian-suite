import React from 'react';
import Header from '@/components/Header';
import EstimateCalculator from '@/components/EstimateCalculator';

const Calculator = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-12">
        <EstimateCalculator />
      </div>
    </div>
  );
};

export default Calculator;