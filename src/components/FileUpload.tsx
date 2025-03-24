import React from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Question } from '../types';

interface FileUploadProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

export function FileUpload({ onQuestionsLoaded }: FileUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const questions: Question[] = jsonData.map((row: any, index) => ({
        id: index + 1,
        question: row.Question || '',
        optionA: row['Option A'] || '',
        optionB: row['Option B'] || '',
        optionC: row['Option C'] || '',
        optionD: row['Option D'] || '',
        correctAnswer: row['Correct Answer'] || '',
      }));

      onQuestionsLoaded(questions);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <Upload className="w-12 h-12 text-gray-400 mb-4" />
      <label className="cursor-pointer">
        <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Upload Excel File
        </span>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
      <p className="mt-2 text-sm text-gray-500">
        Upload your Excel file containing quiz questions
      </p>
    </div>
  );
}