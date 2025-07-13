'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

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
    <div className="max-w-xl mx-auto py-16 px-4">
      <h2 className="font-heading text-3xl font-bold mb-6 text-blue-700 text-center">AI Quiz Generator</h2>
      <form onSubmit={handleGenerateQuiz} className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter a topic (e.g. React, World War II, Photosynthesis)"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Questions</label>
            <select
              value={numQues}
              onChange={e => setNumQues(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              {[5, 10, 15, 20, 30].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        <Button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading || !topic.trim()}
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