'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function QuizPage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [numQues, setNumQues] = useState(5);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQuiz(null);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, numQues }),
      });
      if (!res.ok) throw new Error('Failed to generate quiz');
      const data = await res.json();
      setQuiz(data.quiz);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-20 py-16 px-4">
      <h2 className="font-heading text-3xl font-bold mb-6 text-blue-700 text-center">AI Quiz Generator</h2>
      <form onSubmit={handleGenerateQuiz} className="flex flex-col gap-4 mb-8 items-center">
        <Input
          type="text"
          placeholder="Enter a topic (e.g. React, World War II, Photosynthesis)"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          required
          className="w-[600px] h-[60px] p-[10px] m-[10px]"
        />
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Questions</label>
            <Input
              type="number"
              min="1"
              max="30"
              value={numQues}
              onChange={e => setNumQues(parseInt(e.target.value) || 5)}
              className="w-[200px] h-[40px] p-[10px] m-[10px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
            <div className="flex gap-4 p-[10px] m-[10px]">
              {[
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={option.value}
                    name="difficulty"
                    value={option.value}
                    checked={difficulty === option.value}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor={option.value} className="text-sm font-medium text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button
          variant="default"
          disabled={loading || !topic.trim()}
          className="w-[200px] p-[10px] m-[10px]"
        >
          {loading ? 'Generating...' : 'Generate Quiz'}
        </Button>
      </form>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {quiz && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-heading text-xl font-bold mb-4 text-blue-700">Quiz on: {topic}</h3>
          {quiz.map((q, idx) => (
            <div key={idx} className="mb-6">
              <div className="font-semibold mb-2">{idx + 1}. {q.question}</div>
              <ul className="space-y-2">
                {q.options.map((opt, oidx) => (
                  <li key={oidx} className="pl-2">- {opt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 