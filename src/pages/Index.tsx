
import React from 'react';
import Header from '@/components/Header';
import QuizSetup from '@/components/QuizSetup';
import { BookOpen, Brain, GraduationCap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-haiti-blue p-4 rounded-full">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-haiti-dark">
              Quiz pour le Baccalauréat Haïtien
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Préparez-vous pour le BAC avec des questions générées par intelligence artificielle
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex justify-center mb-4 text-haiti-blue">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="font-bold mb-2">Questions adaptées</h3>
                <p className="text-gray-600 text-sm">
                  Des questions correspondant au programme du baccalauréat haïtien
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex justify-center mb-4 text-haiti-blue">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="font-bold mb-2">Explications détaillées</h3>
                <p className="text-gray-600 text-sm">
                  Comprendre les concepts avec des explications claires pour chaque question
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex justify-center mb-4 text-haiti-blue">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="font-bold mb-2">Suivi de progression</h3>
                <p className="text-gray-600 text-sm">
                  Suivez vos performances et identifiez les domaines à améliorer
                </p>
              </div>
            </div>
          </div>
          
          <QuizSetup />
        </div>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 BacFasil - Un outil d'apprentissage pour les étudiants haïtiens</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
