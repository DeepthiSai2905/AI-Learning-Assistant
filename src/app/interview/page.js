'use client';
import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Checkbox,
  Paper
} from '@mui/material';
import {
  Work as WorkIcon,
  Description as DescriptionIcon,
  QuestionAnswer as QuestionIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
  Business as BusinessIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

export default function InterviewPrepPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [showExplanations, setShowExplanations] = useState({});
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState({
    technical: true,
    behavioral: true,
    situational: true,
    motivation: true
  });
  const [showFollowup, setShowFollowup] = useState({});

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

  const questionTypes = [
    {
      key: 'technical',
      label: 'Technical Questions',
      description: 'Programming, tools, and technical skills',
      icon: <CodeIcon sx={{ color: '#1e3a8a' }} />
    },
    {
      key: 'behavioral',
      label: 'Behavioral Questions',
      description: 'Past experiences and how you handled situations',
      icon: <PsychologyIcon sx={{ color: '#1e3a8a' }} />
    },
    {
      key: 'situational',
      label: 'Situational Questions',
      description: 'How you would handle specific scenarios',
      icon: <BusinessIcon sx={{ color: '#1e3a8a' }} />
    },
    {
      key: 'motivation',
      label: 'Motivation & Culture',
      description: 'Why you want this role and company fit',
      icon: <FavoriteIcon sx={{ color: '#1e3a8a' }} />
    }
  ];

  const handleQuestionTypeChange = (type) => {
    setSelectedQuestionTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleGenerateQuestions = async () => {
    if (!jobDescription.trim() || !resume.trim()) {
      setError('Please provide both job description and resume');
      return;
    }

    const selectedTypes = Object.keys(selectedQuestionTypes).filter(type => selectedQuestionTypes[type]);
    if (selectedTypes.length === 0) {
      setError('Please select at least one question type');
      return;
    }

    setLoading(true);
    setError('');
    setQuestions([]);
    setShowExplanations({});

    try {
      const response = await fetch('/api/generate-interview-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          resume,
          questionTypes: selectedTypes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate interview questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGetExplanation = async (questionIndex) => {
    if (showExplanations[questionIndex]) return;

    try {
      const response = await fetch('/api/get-question-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questions[questionIndex].question,
          jobDescription,
          resume,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get explanation');
      }

      const data = await response.json();
      
      setQuestions(prev => prev.map((q, idx) => 
        idx === questionIndex 
          ? { ...q, explanation: data.explanation }
          : q
      ));
      
      setShowExplanations(prev => ({ ...prev, [questionIndex]: true }));
    } catch (err) {
      setError('Failed to get explanation for this question');
    }
  };

  const resetForm = () => {
    setJobDescription('');
    setResume('');
    setQuestions([]);
    setError('');
    setShowExplanations({});
    setSelectedQuestionTypes({
      technical: true,
      behavioral: true,
      situational: true,
      motivation: true
    });
  };

  const parseExplanationSections = (explanation) => {
    // Split by section headers (1-6)
    const regex = /\*\*What the Interviewer is Looking For:\*\*|\*\*How to Structure Your Answer \(STAR Method\):\*\*|\*\*Key Points to Include \(STAR Method\):\*\*|\*\*Example Approach \(Hypothetical Scenario - STAR Method\):\*\*|\*\*Red Flags to Avoid:\*\*|\*\*Follow-up Considerations:\*\*/g;
    const headers = [
      'What the Interviewer is Looking For',
      'How to Structure Your Answer (STAR Method)',
      'Key Points to Include (STAR Method)',
      'Example Approach (Hypothetical Scenario - STAR Method)',
      'Red Flags to Avoid',
      'Follow-up Considerations'
    ];
    const parts = explanation.split(regex).map(s => s.trim()).filter(Boolean);
    // If the LLM returns the headers, remove them from the content
    let sections = {};
    let idx = 0;
    explanation.replace(regex, (match) => {
      if (parts[idx]) {
        sections[headers[idx]] = parts[idx];
        idx++;
      }
      return '';
    });
    // Fallback: if parsing fails, return the whole explanation as one section
    if (Object.keys(sections).length < 5) {
      return { 'Full Explanation': explanation };
    }
    return sections;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700, 
            color: '#1e3a8a',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <WorkIcon sx={{ fontSize: 40 }} />
            Interview Preparation
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', maxWidth: 600, mx: 'auto' }}>
            Get personalized interview questions based on your job description and resume. 
            Practice with AI-generated questions and get detailed explanations.
          </Typography>
        </Box>

        {!questions.length && (
          <>
            {/* Question Types Selection */}
            <MuiCard sx={{ mb: 4 }}>
              <MuiCardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <QuestionIcon sx={{ color: '#1e3a8a' }} />
                    <Typography variant="h5" sx={{ color: '#1e293b' }}>
                      Select Question Types
                    </Typography>
                  </Box>
                }
              />
              <MuiCardContent>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  Choose the types of interview questions you'd like to practice with:
                </Typography>
                <Grid container spacing={2}>
                  {questionTypes.map((type) => (
                    <Grid item xs={12} sm={6} md={3} key={type.key}>
                      <Paper
                        elevation={selectedQuestionTypes[type.key] ? 2 : 0}
                        sx={{
                          p: 2,
                          border: selectedQuestionTypes[type.key] 
                            ? '2px solid #1e3a8a' 
                            : '2px solid #e2e8f0',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          bgcolor: selectedQuestionTypes[type.key] ? '#f8fafc' : 'white',
                          '&:hover': {
                            borderColor: '#1e3a8a',
                            bgcolor: '#f8fafc'
                          }
                        }}
                        onClick={() => handleQuestionTypeChange(type.key)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Checkbox
                            checked={selectedQuestionTypes[type.key]}
                            readOnly
                            sx={{
                              color: '#1e3a8a',
                              '&.Mui-checked': {
                                color: '#1e3a8a',
                              },
                            }}
                          />
                          {type.icon}
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {type.label}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', pl: 4 }}>
                          {type.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </MuiCardContent>
            </MuiCard>

            {/* Input Form */}
            <MuiCard sx={{ mb: 4 }}>
              <MuiCardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <DescriptionIcon sx={{ color: '#1e3a8a' }} />
                    <Typography variant="h5" sx={{ color: '#1e293b' }}>
                      Input Your Information
                    </Typography>
                  </Box>
                }
              />
              <MuiCardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Job Description"
                      multiline
                      rows={8}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Include key responsibilities, requirements, and company information
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Your Resume"
                      multiline
                      rows={8}
                      value={resume}
                      onChange={(e) => setResume(e.target.value)}
                      placeholder="Paste your resume here..."
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Include your experience, skills, and achievements
                    </Typography>
                  </Grid>
                </Grid>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <MuiButton
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                    onClick={handleGenerateQuestions}
                    disabled={loading || !jobDescription.trim() || !resume.trim() || Object.values(selectedQuestionTypes).every(type => !type)}
                    sx={{
                      bgcolor: '#1e3a8a',
                      '&:hover': { bgcolor: '#1e40af' },
                      px: 4,
                      py: 1.5
                    }}
                  >
                    {loading ? 'Generating Questions...' : 'Generate Interview Questions'}
                  </MuiButton>
                  <MuiButton
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={resetForm}
                    sx={{
                      borderColor: '#1e3a8a',
                      color: '#1e3a8a',
                      '&:hover': { bgcolor: '#f8fafc' }
                    }}
                  >
                    Reset
                  </MuiButton>
                </Box>
              </MuiCardContent>
            </MuiCard>
          </>
        )}

        {questions.length > 0 && (
          <>
            {/* Questions Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 600 }}>
                Generated Interview Questions ({questions.length})
              </Typography>
              <MuiButton
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={resetForm}
                sx={{
                  borderColor: '#1e3a8a',
                  color: '#1e3a8a',
                  '&:hover': { bgcolor: '#f8fafc' }
                }}
              >
                Start Over
              </MuiButton>
            </Box>

            {/* Questions List */}
            <Box sx={{ space: 2 }}>
              {questions.map((question, index) => (
                <MuiCard key={index} sx={{ mb: 3 }}>
                  <MuiCardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Chip 
                        label={`Question ${index + 1}`}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip 
                        label={question.category}
                        color="secondary"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="h6" sx={{ 
                      color: '#1e293b', 
                      mb: 2,
                      fontWeight: 500,
                      lineHeight: 1.4
                    }}>
                      {question.question}
                    </Typography>

                    {question.explanation ? (
                      (() => {
                        const sections = parseExplanationSections(question.explanation);
                        return (
                          <Box sx={{ mt: 2 }}>
                            {Object.entries(sections).map(([header, content], i) => {
                              if (header === 'Follow-up Considerations') {
                                return (
                                  <Box key={header} sx={{ mt: 2 }}>
                                    <MuiButton
                                      variant="outlined"
                                      size="small"
                                      onClick={() => setShowFollowup(prev => ({ ...prev, [index]: !prev[index] }))}
                                      sx={{
                                        borderColor: '#1e3a8a',
                                        color: '#1e3a8a',
                                        mb: 1
                                      }}
                                    >
                                      {showFollowup[index] ? 'Hide' : 'Show'} Follow-up Considerations
                                    </MuiButton>
                                    {showFollowup[index] && (
                                      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, mt: 1 }}>
                                        <Typography variant="subtitle2" sx={{ color: '#1e3a8a', fontWeight: 600, mb: 1 }}>{header}</Typography>
                                        <ReactMarkdown>{content}</ReactMarkdown>
                                      </Box>
                                    )}
                                  </Box>
                                );
                              }
                              return (
                                <Box key={header} sx={{ bgcolor: 'white', p: 2, borderRadius: 1, mb: 2 }}>
                                  <Typography variant="subtitle2" sx={{ color: '#1e3a8a', fontWeight: 600, mb: 1 }}>{header}</Typography>
                                  <ReactMarkdown>{content}</ReactMarkdown>
                                </Box>
                              );
                            })}
                          </Box>
                        );
                      })()
                    ) : (
                      <MuiButton
                        variant="outlined"
                        startIcon={<LightbulbIcon />}
                        onClick={() => handleGetExplanation(index)}
                        sx={{
                          borderColor: '#1e3a8a',
                          color: '#1e3a8a',
                          '&:hover': { bgcolor: '#f8fafc' },
                          mt: 1
                        }}
                      >
                        Get Detailed Explanation
                      </MuiButton>
                    )}
                  </MuiCardContent>
                </MuiCard>
              ))}
            </Box>

            {/* Tips Section */}
            <MuiCard sx={{ mt: 4, bgcolor: '#eff6ff' }}>
              <MuiCardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUpIcon sx={{ color: '#1e3a8a' }} />
                    <Typography variant="h6" sx={{ color: '#1e3a8a' }}>
                      Interview Tips
                    </Typography>
                  </Box>
                }
              />
              <MuiCardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ color: '#1e3a8a', mb: 1, fontWeight: 600 }}>
                      Before the Interview:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, color: '#64748b' }}>
                      <li>Research the company thoroughly</li>
                      <li>Practice your answers out loud</li>
                      <li>Prepare questions to ask the interviewer</li>
                      <li>Dress appropriately for the company culture</li>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ color: '#1e3a8a', mb: 1, fontWeight: 600 }}>
                      During the Interview:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, color: '#64748b' }}>
                      <li>Maintain good eye contact and body language</li>
                      <li>Use the STAR method for behavioral questions</li>
                      <li>Be specific with examples from your experience</li>
                      <li>Ask thoughtful questions about the role</li>
                    </Box>
                  </Grid>
                </Grid>
              </MuiCardContent>
            </MuiCard>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
} 