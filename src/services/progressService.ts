
export interface QuizResult {
  id: string;
  subject: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  date: string;
}

// Save quiz result to localStorage
export const saveQuizResult = (result: QuizResult): void => {
  try {
    const existingResults = getQuizResults();
    existingResults.push(result);
    localStorage.setItem('quizResults', JSON.stringify(existingResults));
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
};

// Get all quiz results from localStorage
export const getQuizResults = (): QuizResult[] => {
  try {
    const resultsString = localStorage.getItem('quizResults');
    return resultsString ? JSON.parse(resultsString) : [];
  } catch (error) {
    console.error('Error getting quiz results:', error);
    return [];
  }
};

// Get average score for a specific subject
export const getAverageScoreBySubject = (subject: string): number => {
  const results = getQuizResults().filter(r => r.subject === subject);
  if (results.length === 0) return 0;
  
  const totalScore = results.reduce((acc, result) => {
    return acc + (result.score / result.totalQuestions * 100);
  }, 0);
  
  return totalScore / results.length;
};

// Get total completed quizzes
export const getTotalCompletedQuizzes = (): number => {
  return getQuizResults().length;
};

// Get completion percentage by subject
export const getSubjectCompletionPercentage = (subjects: string[]): Record<string, number> => {
  const results = getQuizResults();
  const subjectCounts: Record<string, number> = {};
  
  subjects.forEach(subject => {
    subjectCounts[subject] = results.filter(r => r.subject === subject).length;
  });
  
  const totalSubjects = subjects.length;
  const totalPossibleQuizzes = totalSubjects * 5; // Assuming 5 difficulty levels per subject
  
  const percentages: Record<string, number> = {};
  subjects.forEach(subject => {
    percentages[subject] = (subjectCounts[subject] / 5) * 100;
  });
  
  return percentages;
};
