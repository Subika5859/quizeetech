import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Quiz } from './components/Quiz';
import { Question, QuizState } from './types';
import { Trophy, Award, CheckCircle2 } from 'lucide-react';

function App() {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    showResults: false,
    selectedAnswers: {},
  });

  const handleQuestionsLoaded = (questions: Question[]) => {
    if (!questions || questions.length === 0) return;
    
    setQuizState({
      questions,
      currentQuestionIndex: 0,
      score: 0,
      showResults: false,
      selectedAnswers: {},
    });
  };

  const handleAnswerSelect = (answer: string) => {
    if (quizState.selectedAnswers[quizState.currentQuestionIndex]) return;

    const newSelectedAnswers = {
      ...quizState.selectedAnswers,
      [quizState.currentQuestionIndex]: answer,
    };

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const newScore = answer === currentQuestion.correctAnswer 
      ? quizState.score + 1 
      : quizState.score;

    setTimeout(() => {
      if (quizState.currentQuestionIndex === quizState.questions.length - 1) {
        setQuizState(prev => ({
          ...prev,
          showResults: true,
          score: newScore,
          selectedAnswers: newSelectedAnswers,
        }));
      } else {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          score: newScore,
          selectedAnswers: newSelectedAnswers,
        }));
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      score: 0,
      showResults: false,
      selectedAnswers: {},
    }));
  };

  if (quizState.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Quiz Game
          </h1>
          <FileUpload onQuestionsLoaded={handleQuestionsLoaded} />
        </div>
      </div>
    );
  }

  if (quizState.showResults) {
    const percentage = (quizState.score / quizState.questions.length) * 100;
    let message = '';
    let icon = null;

    if (percentage === 100) {
      message = 'Perfect Score! Outstanding!';
      icon = <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />;
    } else if (percentage >= 80) {
      message = 'Excellent Work!';
      icon = <Award className="w-16 h-16 mx-auto mb-4 text-blue-500" />;
    } else {
      message = 'Good Try!';
      icon = <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />;
    }

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          {icon}
          <h2 className="text-3xl font-bold mb-2">{message}</h2>
          <div className="mb-6">
            <p className="text-xl mb-2">
              Final Score: {quizState.score} out of {quizState.questions.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-lg mt-2 text-gray-600">
              {percentage.toFixed(1)}% Correct
            </p>
          </div>
          <button
            onClick={restartQuiz}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const selectedAnswer = quizState.selectedAnswers[quizState.currentQuestionIndex];
  const showCorrect = selectedAnswer != null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quiz Game</h1>
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold">
              Score: {quizState.score} / {quizState.questions.length}
            </div>
            <div className="text-lg font-semibold">
              Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
            </div>
          </div>
        </div>
        
        <Quiz
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          showCorrect={showCorrect}
        />
      </div>
    </div>
  );
}

export default App;