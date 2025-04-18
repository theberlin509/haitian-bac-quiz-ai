
import React from 'react';
import Header from '@/components/Header';
import Progress from '@/components/Progress';

const ProgressPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Progress />
      </main>
    </div>
  );
};

export default ProgressPage;
