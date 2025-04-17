
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateQuizQuestions, QuizQuestion } from '@/services/aiService';
import { saveQuizResult } from '@/services/progressService';
import { SUBJECTS, DIFFICULTY_LEVELS } from '@/lib/constants';
import { CheckCircle, XCircle, Clock, AlertCircle, Brain } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, difficulty, questionCount, timePerQuestion } = location.state || {};
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Format subject and difficulty names for display
  const subjectName = SUBJECTS.find(s => s.id === subject)?.name || subject;
  const difficultyName = DIFFICULTY_LEVELS.find(d => d.id === difficulty)?.name || difficulty;
  
  useEffect(() => {
    // Redirect if no quiz parameters
    if (!subject || !difficulty || !questionCount || !timePerQuestion) {
      navigate('/');
      return;
    }
    
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const generatedQuestions = await generateQuizQuestions(subject, difficulty, questionCount);
        setQuestions(generatedQuestions);
        setError(null);
      } catch (err: any) {
        console.error('Error loading questions:', err);
        setError(err.message || 'Erreur lors de la génération des questions. Veuillez réessayer.');
        toast.error('Erreur lors de la génération des questions.');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [subject, difficulty, questionCount, navigate, timePerQuestion]);
  
  // Timer for each question
  useEffect(() => {
    if (loading || submitted || quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time runs out
          if (!submitted) {
            setSubmitted(true);
            toast.warning('Temps écoulé!');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentIndex, loading, submitted, quizCompleted]);
  
  // Reset timer when moving to next question
  useEffect(() => {
    setTimeLeft(timePerQuestion);
    setSelectedOption(null);
    setSubmitted(false);
  }, [currentIndex, timePerQuestion]);
  
  const handleOptionSelect = (index: number) => {
    if (!submitted) {
      setSelectedOption(index);
    }
  };
  
  const handleSubmit = () => {
    if (selectedOption === null) {
      toast.warning('Veuillez sélectionner une réponse.');
      return;
    }
    
    setSubmitted(true);
    
    // Check if answer is correct and update score
    if (selectedOption === questions[currentIndex].correctOptionIndex) {
      setScore(prevScore => prevScore + 1);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      
      // Save quiz result
      const quizResult = {
        id: `quiz-${Date.now()}`,
        subject,
        difficulty,
        score,
        totalQuestions: questions.length,
        date: new Date().toISOString(),
      };
      
      saveQuizResult(quizResult);
      toast.success('Quiz terminé! Vos résultats ont été enregistrés.');
    }
  };
  
  const handleRetry = () => {
    navigate(0); // Refresh the page to restart the quiz
  };
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Génération de questions en cours...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="animate-pulse-slow w-16 h-16 text-haiti-blue">
                <Brain className="w-full h-full" />
              </div>
            </div>
            <p className="text-center text-muted-foreground">
              Notre IA est en train de générer des questions de qualité pour votre quiz.
              Cela peut prendre quelques instants...
            </p>
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="w-full max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={handleBackToHome}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }
  
  // Quiz completed state
  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Résultats du Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-6xl font-bold text-haiti-blue mb-2">{percentage}%</p>
              <p className="text-xl">
                Vous avez obtenu <span className="font-bold">{score}/{questions.length}</span> réponses correctes
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground">Matière: <span className="font-medium text-foreground">{subjectName}</span></p>
              <p className="text-muted-foreground">Difficulté: <span className="font-medium text-foreground">{difficultyName}</span></p>
            </div>
            
            <Alert variant={percentage >= 70 ? "default" : "destructive"} className="bg-opacity-50">
              {percentage >= 70 ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {percentage >= 70 ? "Félicitations!" : "Continuez vos efforts!"}
              </AlertTitle>
              <AlertDescription>
                {percentage >= 70 
                  ? "Vous avez bien réussi ce quiz. Continuez ainsi pour le bac!"
                  : "N'abandonnez pas, continuez à vous entraîner pour améliorer vos résultats."}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex gap-4 flex-wrap justify-center">
            <Button onClick={handleRetry} variant="outline">
              Refaire ce quiz
            </Button>
            <Button onClick={handleBackToHome} className="bg-haiti-blue hover:bg-haiti-blue/90">
              Nouveau quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Active quiz state
  const currentQuestion = questions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">
              Question {currentIndex + 1} sur {questions.length}
            </p>
            <div className="flex items-center gap-1 bg-haiti-light px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 text-haiti-blue" />
              <span className={`font-medium ${timeLeft < 10 ? 'text-haiti-red' : 'text-haiti-blue'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="mt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {subjectName} · {difficultyName}
            </p>
            <CardTitle className="text-lg mt-2">{currentQuestion.question}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedOption?.toString()} className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-2 p-3 rounded-md transition-colors cursor-pointer ${
                  submitted && index === currentQuestion.correctOptionIndex
                    ? 'bg-green-50 border border-green-200'
                    : submitted && selectedOption === index && index !== currentQuestion.correctOptionIndex
                    ? 'bg-red-50 border border-red-200'
                    : selectedOption === index
                    ? 'bg-haiti-light border border-haiti-blue/30'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                <RadioGroupItem 
                  value={index.toString()} 
                  id={`option-${index}`} 
                  disabled={submitted}
                  className="mt-1"
                />
                <div className="w-full">
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex justify-between w-full cursor-pointer"
                  >
                    <span>{option}</span>
                    {submitted && index === currentQuestion.correctOptionIndex && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {submitted && selectedOption === index && index !== currentQuestion.correctOptionIndex && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
          
          {submitted && (
            <Alert className="mt-6 bg-haiti-light border-haiti-blue/20">
              <AlertTitle className="text-haiti-blue font-medium">Explication</AlertTitle>
              <AlertDescription className="text-haiti-dark mt-2">
                {currentQuestion.explanation}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!submitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={selectedOption === null}
              className="w-full bg-haiti-blue hover:bg-haiti-blue/90"
            >
              Valider
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              className="w-full bg-haiti-blue hover:bg-haiti-blue/90"
            >
              {currentIndex < questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Quiz;
