'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function QuizPage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [numQues, setNumQues] = useState(5);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQuiz(null);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setQuizStarted(false);
    setTimeLeft(0);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, numQues }),
      });
      if (!res.ok) throw new Error('Failed to generate quiz');
      const data = await res.json();
      setQuiz(data.quiz);
      // Set timer based on number of questions (2 minutes per question)
      setTimeLeft(numQues * 120);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, selectedAnswer) => {
    if (!quizStarted) {
      setQuizStarted(true);
    }
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedAnswer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quiz.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctAnswers++;
      }
    });
    const calculatedScore = Math.round((correctAnswers / quiz.length) * 100);
    setScore(calculatedScore);
    return { correctAnswers, total: quiz.length, percentage: calculatedScore };
  };

  const handleSubmitQuiz = () => {
    const results = calculateScore();
    setShowResults(true);
    setQuizStarted(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Great job!';
    if (score >= 70) return 'Good work!';
    if (score >= 60) return 'Not bad!';
    return 'Keep practicing!';
  };

  const resetQuiz = () => {
    setQuiz(null);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setQuizStarted(false);
    setTimeLeft(0);
  };

  return (
    <div className="my-20 py-16 px-4">
      <h2 className="font-heading text-3xl font-bold mb-6 text-blue-700 text-center">AI Quiz Generator</h2>
      
      {!quiz && (
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
      )}

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {quiz && !showResults && (
        <div className="max-w-4xl mx-auto">
          {/* Header with Timer and Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-center gap-10">
                <Badge variant="default" className="text-lg p-4 m-4">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
                </Badge>
                <span className="text-lg font-large text-gray-700">
                  Topic: {topic}
                </span>
                <div className="flex flex-row gap-10 items-center">
                  <div className="text-sm text-gray-600">Time Remaining  </div>
                  <div className={`text-lg font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestion + 1} of {quiz.length}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Object.keys(userAnswers).length} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card - Centered with Fixed Width */}
          <div className="flex justify-center mb-6">
            <Card className="w-[400px] min-h-[400px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    Question {currentQuestion + 1}
                  </Badge>
                  <div className="text-lg leading-tight">{quiz[currentQuestion].question}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center p-16">
                <div className="space-y-3">
                  {quiz[currentQuestion].options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        userAnswers[currentQuestion] === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion, option)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          userAnswers[currentQuestion] === option
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {userAnswers[currentQuestion] === option && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Buttons - Centered */}
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-6"
            >
              Previous
            </Button>
            
            {currentQuestion < quiz.length - 1 ? (
              <Button
                variant="default"
                onClick={handleNextQuestion}
                disabled={!userAnswers[currentQuestion]}
                className="px-6"
              >
                Next
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length < quiz.length}
                className="px-6"
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      )}

{showResults && quiz && (
  <div className="max-w-4xl mx-auto">
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-semibold">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-8">
          <div className={`text-5xl font-bold mb-4 ${getScoreColor(score)}`}>
            {score}%
          </div>
          <div className="text-2xl text-gray-600 mb-6">
            {getScoreMessage(score)}
          </div>
          <div className="text-xl text-gray-700">
            You got {Object.values(userAnswers).filter((answer, index) => 
              answer === quiz[index].answer
            ).length} out of {quiz.length} questions correct
          </div>
          {timeLeft > 0 && (
            <div className="text-xl text-gray-500 mt-4">
              Time taken: {formatTime(numQues * 120 - timeLeft)}
            </div>
          )}
        </div>

        {/* Results Cards - Centered Column Layout */}
        <div className="flex flex-col items-center space-y-24">
          {quiz.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.answer;
            
            return (
              <Card key={index} className={`w-[500px] border-2 ${
                isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <CardContent className="pt-6 px-8 pb-10">
                  <div className="flex items-start gap-4 mb-6">
                    <Badge variant={isCorrect ? "default" : "destructive"} className="text-md font-semibold">
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </Badge>
                    <div className="font-medium text-xl">Question {index + 1}</div>
                  </div>
                  <p className="text-xl text-gray-700 mb-6">{question.question}</p>
                  <div className="space-y-6">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-4 rounded-lg border ${
                          option === question.answer
                            ? 'border-green-500 bg-green-100'
                            : option === userAnswer && !isCorrect
                            ? 'border-red-500 bg-red-100'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          {option === question.answer && (
                            <span className="text-green-600 font-bold text-2xl">✓</span>
                          )}
                          {option === userAnswer && !isCorrect && (
                            <span className="text-red-600 font-bold text-2xl">✗</span>
                          )}
                          <span className={`text-lg ${option === question.answer ? 'font-semibold text-green-700' : ''}`}>
                            {option}
                          </span>
                          {option === question.answer && (
                            <Badge variant="outline" className="text-xs ml-auto">
                              Correct Answer
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <Button onClick={resetQuiz} variant="outline" className="px-8 py-4 text-lg">
            Take Another Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
)}
    </div>
  );
} 