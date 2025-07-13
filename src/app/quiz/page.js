'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="mx-auto py-16 px-4">
      <h2 className="font-heading text-3xl font-bold mb-6 text-blue-700 text-center">AI Quiz Generator</h2>
      <form onSubmit={handleGenerateQuiz} className="flex flex-col gap-4 mb-8">
        <Input
          type="text"
          placeholder="Enter a topic (e.g. React, World War II, Photosynthesis)"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          required
        />
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Questions</label>
            <Select value={numQues} onValueChange={setNumQues}>
              <SelectTrigger>
                <SelectValue placeholder="Select questions" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20, 30].map(n => (
                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
            <Select value={difficulty} onValueChange={setDifficulty} className="Select difficulty">
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
           
          </div>
        </div>
        <Button
          variant="default"
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