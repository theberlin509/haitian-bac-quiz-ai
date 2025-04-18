
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { SUBJECTS } from '@/lib/constants';
import { getQuizResults, getAverageScoreBySubject, getTotalCompletedQuizzes } from '@/services/progressService';
import { BarChart3, Award, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Progress: React.FC = () => {
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  const [subjectScores, setSubjectScores] = useState<{ id: string, name: string, score: number }[]>([]);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  
  useEffect(() => {
    // Get all quiz results
    const results = getQuizResults();
    setTotalQuizzes(getTotalCompletedQuizzes());
    
    // Get recent quizzes (limited to 5)
    const sortedResults = [...results].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 5);
    
    setRecentQuizzes(sortedResults);
    
    // Calculate scores by subject
    const subjectScoreData = SUBJECTS.map(subject => ({
      id: subject.id,
      name: subject.name,
      score: getAverageScoreBySubject(subject.id)
    })).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
    
    setSubjectScores(subjectScoreData);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-haiti-blue" />
        Suivi de votre progression
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quizzes complétés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-haiti-blue mr-2" />
              <div className="text-2xl font-bold">{totalQuizzes}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Matières étudiées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-haiti-blue mr-2" />
              <div className="text-2xl font-bold">{subjectScores.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meilleure matière
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-6 w-6 text-haiti-blue mr-2" />
              <div className="text-2xl font-bold">
                {subjectScores.length > 0 
                  ? subjectScores[0].name 
                  : "Aucune donnée"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-haiti-blue" />
              Performance par matière
            </CardTitle>
            <CardDescription>
              Votre score moyen par matière
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subjectScores.length > 0 ? (
              <div className="space-y-4">
                {subjectScores.map((subject) => (
                  <div key={subject.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {subject.name}
                      </span>
                      <span className="text-sm font-medium">
                        {Math.round(subject.score)}%
                      </span>
                    </div>
                    <ProgressBar value={subject.score} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Vous n'avez pas encore complété de quiz.
                Commencez à vous entraîner pour voir vos statistiques!
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-haiti-blue" />
              Quizzes récents
            </CardTitle>
            <CardDescription>
              Vos derniers quizzes complétés
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentQuizzes.length > 0 ? (
              <div className="space-y-4">
                {recentQuizzes.map((quiz) => {
                  const score = (quiz.score / quiz.totalQuestions) * 100;
                  const subject = SUBJECTS.find(s => s.id === quiz.subject)?.name || quiz.subject;
                  
                  return (
                    <div key={quiz.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{subject}</div>
                        <div className={`text-sm px-2 py-0.5 rounded-full ${
                          score >= 70 
                            ? 'bg-green-100 text-green-800' 
                            : score >= 50 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {Math.round(score)}%
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>Score: {quiz.score}/{quiz.totalQuestions}</span>
                        <span>{format(new Date(quiz.date), 'dd/MM/yyyy')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucun quiz complété pour le moment.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
