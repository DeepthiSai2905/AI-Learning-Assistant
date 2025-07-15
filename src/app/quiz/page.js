'use client';
import { useState, useEffect } from 'react';

// Material UI imports
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  LinearProgress,
  Chip,
  Grid,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import {
  Quiz as QuizIcon,
  Timer as TimerIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

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

  // Create navy blue and white theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1e3a8a', // Navy blue
        light: '#3b82f6',
        dark: '#1e40af',
      },
      secondary: {
        main: '#64748b', // Slate gray
      },
      background: {
        default: '#ffffff',
        paper: '#f8fafc',
      },
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        color: '#1e293b',
      },
      h2: {
        fontWeight: 600,
        color: '#1e293b',
      },
      h3: {
        fontWeight: 600,
        color: '#1e293b',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
  });

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
    // const results = calculateScore();
    setShowResults(true);
    setQuizStarted(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700, 
            color: '#1e3a8a',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <QuizIcon sx={{ fontSize: 40 }} />
            AI Quiz Generator
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Generate personalized quizzes on any topic with AI
          </Typography>
        </Box>
        
        {!quiz && (
          <MuiCard sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
            <MuiCardContent>
              <form onSubmit={handleGenerateQuiz}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Enter a topic (e.g. React, World War II, Photosynthesis)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    variant="outlined"
                    size="large"
                    sx={{ mb: 3 }}
                  />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Number of Questions"
                        type="number"
                        value={numQues}
                        onChange={(e) => setNumQues(parseInt(e.target.value) || 5)}
                        inputProps={{ min: 1, max: 30 }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ color: '#1e293b', fontWeight: 500 }}>
                          Difficulty Level
                        </FormLabel>
                        <RadioGroup
                          row
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                        >
                          {[
                            { value: 'easy', label: 'Easy' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'hard', label: 'Hard' }
                          ].map((option) => (
                            <FormControlLabel
                              key={option.value}
                              value={option.value}
                              control={<Radio />}
                              label={option.label}
                              sx={{ color: '#64748b' }}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                
                <MuiButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading || !topic.trim()}
                  sx={{
                    bgcolor: '#1e3a8a',
                    '&:hover': { bgcolor: '#1e40af' },
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  {loading ? 'Generating Quiz...' : 'Generate Quiz'}
                </MuiButton>
              </form>
            </MuiCardContent>
          </MuiCard>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography color="error" variant="body1">
              {error}
            </Typography>
          </Box>
        )}

        {quiz && !showResults && (
          <Grid container spacing={2}>
            {/* Left Panel - Quiz Info */}
            <Grid item xs={12} md={3}>
              <MuiCard sx={{ position: 'sticky', top: 20, maxHeight: 'calc(100vh - 40px)', overflow: 'auto' }}>
                <MuiCardContent sx={{ p: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level`}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" sx={{ color: '#1e3a8a', fontWeight: 500, wordBreak: 'break-word' }}>
                      {topic}
                    </Typography>
                  </Box>

                  {/* Timer */}
                  <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <TimerIcon sx={{ color: '#1e3a8a', fontSize: 16 }} />
                      <Typography variant="caption" color="text.secondary">
                        Time Remaining
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold',
                      color: timeLeft < 60 ? '#ef4444' : '#1e3a8a',
                      fontSize: '1.25rem'
                    }}>
                      {formatTime(timeLeft)}
                    </Typography>
                  </Box>

                  {/* Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {currentQuestion + 1} / {quiz.length}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={((currentQuestion + 1) / quiz.length) * 100}
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: '#e2e8f0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#1e3a8a'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, textAlign: 'center', display: 'block' }}>
                      {Object.keys(userAnswers).length} of {quiz.length} answered
                    </Typography>
                  </Box>

                  {/* Question Navigation */}
                  <Box>
                    <Typography variant="caption" sx={{ color: '#1e293b', fontWeight: 500, mb: 1, display: 'block' }}>
                      Questions
                    </Typography>
                    <Grid container spacing={0.5}>
                      {quiz.map((_, index) => (
                        <Grid item key={index}>
                          <MuiButton
                            size="small"
                            variant={currentQuestion === index ? "contained" : "outlined"}
                            onClick={() => setCurrentQuestion(index)}
                            sx={{
                              minWidth: 32,
                              height: 32,
                              fontSize: '0.75rem',
                              bgcolor: currentQuestion === index ? '#1e3a8a' : 
                                       userAnswers[index] ? '#10b981' : 'transparent',
                              color: currentQuestion === index || userAnswers[index] ? 'white' : '#64748b',
                              borderColor: userAnswers[index] ? '#10b981' : '#e2e8f0',
                              '&:hover': {
                                bgcolor: currentQuestion === index ? '#1e40af' : '#f1f5f9'
                              }
                            }}
                          >
                            {index + 1}
                          </MuiButton>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </MuiCardContent>
              </MuiCard>
            </Grid>

            {/* Right Panel - Quiz Question */}
            <Grid item xs={12} md={9}>
              <MuiCard sx={{ maxHeight: 'calc(100vh - 40px)', overflow: 'auto' }}>
                <MuiCardHeader
                  sx={{ pb: 1 }}
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`Question ${currentQuestion + 1}`}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Typography variant="h6" sx={{ color: '#1e293b', wordBreak: 'break-word', lineHeight: 1.3 }}>
                        {quiz[currentQuestion].question}
                      </Typography>
                    </Box>
                  }
                />
                <MuiCardContent sx={{ p: 2 }}>
                  <Box sx={{ mb: 3 }}>
                    {quiz[currentQuestion].options.map((option, optionIndex) => (
                      <Paper
                        key={optionIndex}
                        elevation={userAnswers[currentQuestion] === option ? 1 : 0}
                        sx={{
                          p: 2,
                          mb: 1.5,
                          cursor: 'pointer',
                          border: 1.5,
                          borderColor: userAnswers[currentQuestion] === option ? '#1e3a8a' : '#e2e8f0',
                          bgcolor: userAnswers[currentQuestion] === option ? '#f8fafc' : 'white',
                          '&:hover': {
                            borderColor: '#1e3a8a',
                            bgcolor: '#f8fafc'
                          },
                          transition: 'all 0.2s ease',
                          wordBreak: 'break-word'
                        }}
                        onClick={() => handleAnswerSelect(currentQuestion, option)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              border: 2,
                              borderColor: userAnswers[currentQuestion] === option ? '#1e3a8a' : '#cbd5e1',
                              bgcolor: userAnswers[currentQuestion] === option ? '#1e3a8a' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              mt: 0.25
                            }}
                          >
                            {userAnswers[currentQuestion] === option && (
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  bgcolor: 'white'
                                }}
                              />
                            )}
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: userAnswers[currentQuestion] === option ? '#1e3a8a' : '#1e293b',
                              fontWeight: userAnswers[currentQuestion] === option ? 500 : 400,
                              lineHeight: 1.4
                            }}
                          >
                            {option}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>

                  {/* Navigation Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5, borderTop: 1, borderColor: '#e2e8f0' }}>
                    <MuiButton
                      variant="outlined"
                      startIcon={<PrevIcon />}
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 0}
                      size="small"
                      sx={{
                        borderColor: '#1e3a8a',
                        color: '#1e3a8a',
                        '&:hover': {
                          borderColor: '#1e40af',
                          bgcolor: '#f8fafc'
                        }
                      }}
                    >
                      Previous
                    </MuiButton>
                    
                    {currentQuestion < quiz.length - 1 ? (
                      <MuiButton
                        variant="contained"
                        endIcon={<NextIcon />}
                        onClick={handleNextQuestion}
                        disabled={!userAnswers[currentQuestion]}
                        size="small"
                        sx={{
                          bgcolor: '#1e3a8a',
                          '&:hover': { bgcolor: '#1e40af' }
                        }}
                      >
                        Next
                      </MuiButton>
                    ) : (
                      <MuiButton
                        variant="contained"
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(userAnswers).length < quiz.length}
                        size="small"
                        sx={{
                          bgcolor: '#10b981',
                          '&:hover': { bgcolor: '#059669' }
                        }}
                      >
                        Submit Quiz
                      </MuiButton>
                    )}
                  </Box>
                </MuiCardContent>
              </MuiCard>
            </Grid>
          </Grid>
        )}

        {showResults && quiz && (
          <MuiCard>
            <MuiCardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Typography variant="h4" sx={{ color: '#1e3a8a', fontWeight: 700 }}>
                    Quiz Results
                  </Typography>
                  {/* Circular Score */}
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, #e2e8f0 ${score * 3.6}deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          bgcolor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: getScoreColor(score)
                          }}
                        >
                          {score}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              }
            />
            <MuiCardContent>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ color: getScoreColor(score), fontWeight: 600, mb: 1 }}>
                  {getScoreMessage(score)}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  You got {Object.values(userAnswers).filter((answer, index) => 
                    answer === quiz[index].answer
                  ).length} out of {quiz.length} questions correct
                </Typography>
                {timeLeft > 0 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    Time taken: {formatTime(numQues * 120 - timeLeft)}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ space: 2 }}>
                {quiz.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = userAnswer === question.answer;
                  
                  return (
                    <MuiCard key={index} sx={{ 
                      mb: 2,
                      border: 1.5,
                      borderColor: isCorrect ? '#10b981' : '#ef4444',
                      bgcolor: isCorrect ? '#f0fdf4' : '#fef2f2'
                    }}>
                      <MuiCardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                          <Chip 
                            icon={isCorrect ? <CheckIcon /> : <CancelIcon />}
                            label={isCorrect ? 'Correct' : 'Incorrect'}
                            color={isCorrect ? 'success' : 'error'}
                            variant="outlined"
                            size="small"
                          />
                          <Typography variant="subtitle2" sx={{ color: '#1e293b', fontWeight: 600 }}>
                            Question {index + 1}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 2, color: '#1e293b', wordBreak: 'break-word' }}>
                          {question.question}
                        </Typography>
                        
                        <Box sx={{ space: 1 }}>
                          {question.options.map((option, optionIndex) => (
                            <Paper
                              key={optionIndex}
                              sx={{
                                p: 1.5,
                                mb: 1,
                                border: 1.5,
                                borderColor: option === question.answer ? '#10b981' : 
                                             option === userAnswer && !isCorrect ? '#ef4444' : '#e2e8f0',
                                bgcolor: option === question.answer ? '#f0fdf4' : 
                                        option === userAnswer && !isCorrect ? '#fef2f2' : 'white',
                                wordBreak: 'break-word'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                {option === question.answer && (
                                  <CheckIcon sx={{ color: '#10b981', fontSize: 18, mt: 0.25 }} />
                                )}
                                {option === userAnswer && !isCorrect && (
                                  <CancelIcon sx={{ color: '#ef4444', fontSize: 18, mt: 0.25 }} />
                                )}
                                <Typography 
                                  variant="body2"
                                  sx={{ 
                                    color: option === question.answer ? '#10b981' : '#1e293b',
                                    fontWeight: option === question.answer ? 600 : 400,
                                    lineHeight: 1.4
                                  }}
                                >
                                  {option}
                                </Typography>
                                {option === question.answer && (
                                  <Chip 
                                    label="Correct" 
                                    size="small" 
                                    color="success" 
                                    variant="outlined"
                                    sx={{ ml: 'auto', fontSize: '0.7rem' }}
                                  />
                                )}
                              </Box>
                            </Paper>
                          ))}
                        </Box>
                      </MuiCardContent>
                    </MuiCard>
                  );
                })}
              </Box>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <MuiButton
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={resetQuiz}
                  sx={{
                    borderColor: '#1e3a8a',
                    color: '#1e3a8a',
                    '&:hover': {
                      borderColor: '#1e40af',
                      bgcolor: '#f8fafc'
                    }
                  }}
                >
                  Take Another Quiz
                </MuiButton>
              </Box>
            </MuiCardContent>
          </MuiCard>
        )}
      </Container>
    </ThemeProvider>
  );
} 