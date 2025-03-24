import React from 'react';
import { Question } from '../types';
import clsx from 'clsx';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showCorrect: boolean;
}

export function Quiz({ question, selectedAnswer, onAnswerSelect, showCorrect }: QuizProps) {
  // Early return with loading state if question is undefined
  if (!question) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <p className="text-lg text-gray-700">Loading question...</p>
      </div>
    );
  }

  const options = [
    { key: 'A', value: question.optionA },
    { key: 'B', value: question.optionB },
    { key: 'C', value: question.optionC },
    { key: 'D', value: question.optionD },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Question {question.id}
      </h2>
      <p className="text-lg mb-8 text-gray-700">{question.question}</p>
      
      <div className="space-y-4">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.key;
          const isCorrect = option.key === question.correctAnswer;
          const showFeedback = showCorrect && isSelected;

          return (
            <button
              key={option.key}
              onClick={() => onAnswerSelect(option.key)}
              disabled={showCorrect}
              className={clsx(
                "w-full p-4 text-left rounded-lg transition-all flex items-center justify-between",
                "hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
                {
                  "bg-blue-100": isSelected && !showCorrect,
                  "bg-green-100": showCorrect && isCorrect,
                  "bg-red-100": showCorrect && isSelected && !isCorrect,
                  "opacity-60": showCorrect && !isCorrect && !isSelected,
                }
              )}
            >
              <div>
                <span className="font-semibold">{option.key}.</span> {option.value}
              </div>
              {showFeedback && (
                isCorrect ? 
                  <CheckCircle className="w-6 h-6 text-green-600" /> :
                  <XCircle className="w-6 h-6 text-red-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}