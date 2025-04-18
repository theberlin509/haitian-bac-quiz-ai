
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SUBJECTS, DIFFICULTY_LEVELS, QUESTION_COUNTS, TIME_PER_QUESTION } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Clock, BookOpen, BarChart } from 'lucide-react';
import { toast } from 'sonner';

const QuizSetup: React.FC = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(60);
  const [loading, setLoading] = useState(false);

  const handleStartQuiz = () => {
    if (!subject || !difficulty) {
      toast.error('Veuillez sélectionner une matière et un niveau de difficulté.');
      return;
    }

    setLoading(true);
    
    // We'll pass these parameters to the quiz page
    navigate(`/quiz`, { 
      state: { 
        subject, 
        difficulty, 
        questionCount, 
        timePerQuestion 
      } 
    });
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-haiti-blue" />
          Configurer votre Quiz
        </CardTitle>
        <CardDescription>
          Personnalisez votre session d'entraînement pour le Baccalauréat Haïtien
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Matière
          </Label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger id="subject">
              <SelectValue placeholder="Sélectionner une matière" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((subj) => (
                <SelectItem key={subj.id} value={subj.id}>
                  {subj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="difficulty" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Niveau de difficulté
          </Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_LEVELS.map((diff) => (
                <SelectItem key={diff.id} value={diff.id}>
                  {diff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="questionCount" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Nombre de questions
          </Label>
          <Select 
            value={questionCount.toString()} 
            onValueChange={(value) => setQuestionCount(parseInt(value))}
          >
            <SelectTrigger id="questionCount">
              <SelectValue placeholder="Sélectionner un nombre" />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_COUNTS.map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count} questions
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timePerQuestion" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Temps par question
          </Label>
          <Select 
            value={timePerQuestion.toString()} 
            onValueChange={(value) => setTimePerQuestion(parseInt(value))}
          >
            <SelectTrigger id="timePerQuestion">
              <SelectValue placeholder="Sélectionner une durée" />
            </SelectTrigger>
            <SelectContent>
              {TIME_PER_QUESTION.map((time) => (
                <SelectItem key={time} value={time.toString()}>
                  {time} secondes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleStartQuiz} 
          className="w-full bg-haiti-blue hover:bg-haiti-blue/90"
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Commencer le Quiz'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizSetup;
