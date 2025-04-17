
import React from 'react';
import Header from '@/components/Header';
import Quiz from '@/components/Quiz';

const QuizPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Quiz />
      </main>
    </div>
  );
};

export default QuizPage;
