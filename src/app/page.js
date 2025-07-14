'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Brain, 
  Target, 
  Users, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Star
} from 'lucide-react';

// Material UI imports
import { 
  Container,
  Typography,
  Box,
  Grid,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  Button as MuiButton,
  Chip,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  Work as WorkIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(null);

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
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
    },
  });

  const features = [
    {
      id: 'quiz',
      title: 'AI Quiz Generator',
      description: 'Generate personalized quizzes on any topic with varying difficulty levels',
      icon: QuizIcon,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      href: '/quiz',
      features: ['Multiple difficulty levels', 'Custom topic selection', 'Real-time scoring', 'Progress tracking'],
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
    },
    {
      id: 'learn',
      title: 'Study Plans',
      description: 'Get AI-powered personalized study plans tailored to your learning goals',
      icon: SchoolIcon,
      color: '#10b981',
      bgColor: '#ecfdf5',
      href: '/learn',
      features: ['Personalized curriculum', 'Adaptive learning', 'Goal tracking', 'Progress analytics'],
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      id: 'interview',
      title: 'Interview Prep',
      description: 'Practice with AI-generated interview questions and get instant feedback',
      icon: WorkIcon,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      href: '/interview',
      features: ['Industry-specific questions', 'Real-time feedback', 'Performance analytics', 'Mock interviews'],
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
      id: 'dashboard',
      title: 'Progress Dashboard',
      description: 'Track your learning progress with detailed analytics and insights',
      icon: DashboardIcon,
      color: '#8b5cf6',
      bgColor: '#f3f4f6',
      href: '/dashboard',
      features: ['Learning analytics', 'Achievement badges', 'Study streaks', 'Performance insights'],
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    }
  ];

  const stats = [
    { label: 'Topics Covered', value: '100+', icon: BookOpen },
    { label: 'Questions Generated', value: '10K+', icon: Brain },
    { label: 'Active Learners', value: '5K+', icon: Users },
    { label: 'Success Rate', value: '95%', icon: Trophy }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 12 }}>
              
              <Typography variant="h2" component="h1" sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}>
                Master Any Subject with
                <Box component="span" sx={{ 
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'block'
                }}>
                  AI-Powered Learning
                </Box>
              </Typography>
              <Typography variant="h6" sx={{ 
                color: '#64748b', 
                mb: 4, 
                maxWidth: 600, 
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Personalized study plans, intelligent quizzes, and comprehensive interview preparation 
                all powered by cutting-edge AI technology.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                <MuiButton
                  component={Link}
                  href="/signup"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight />}
                  sx={{
                    bgcolor: '#1e3a8a',
                    '&:hover': { bgcolor: '#1e40af' },
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Start Learning Free
                </MuiButton>
                <MuiButton
                  component={Link}
                  href="/learn"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#1e3a8a',
                    color: '#1e3a8a',
                    '&:hover': { bgcolor: '#f8fafc' },
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Explore Features
                </MuiButton>
              </Box>
            </Box>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 bg-gray-50">
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      bgcolor: '#eff6ff', 
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <stat.icon className="w-8 h-8 text-blue-600" />
                    </Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold', 
                      color: '#1e293b', 
                      mb: 0.5 
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>

        {/* Features Grid - 2x2 Layout */}
        <section className="py-16 px-4">
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                mb: 2
              }}>
                Everything You Need to Succeed
              </Typography>
              <Typography variant="h6" sx={{ 
                color: '#64748b', 
                maxWidth: 600, 
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Our comprehensive suite of AI-powered tools helps you learn faster, 
                retain more, and achieve your goals.
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {features.map((feature) => (
                <Grid item xs={12} md={6} key={feature.id}>
                  <MuiCard 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                    component={Link}
                    href={feature.href}
                  >
                    <MuiCardHeader
                      sx={{
                        background: feature.gradient,
                        color: 'white',
                        '& .MuiCardHeader-content': {
                          color: 'white'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: 'rgba(255,255,255,0.2)',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <feature.icon sx={{ fontSize: 28, color: 'white' }} />
                        </Box>
                        <Box>
                          <Typography variant="h5" sx={{ 
                            fontWeight: 600,
                            color: 'white'
                          }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            mt: 0.5
                          }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </MuiCardHeader>
                    <MuiCardContent sx={{ p: 3 }}>
                      <Box sx={{ mb: 3 }}>
                        {feature.features.map((feat, index) => (
                          <Box key={index} sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5, 
                            mb: 1.5 
                          }}>
                            <Box sx={{ 
                              width: 6, 
                              height: 6, 
                              bgcolor: feature.color, 
                              borderRadius: '50%' 
                            }} />
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              {feat}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <MuiButton
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowRight />}
                        sx={{
                          bgcolor: feature.color,
                          '&:hover': { 
                            bgcolor: feature.color,
                            opacity: 0.9
                          }
                        }}
                      >
                        Get Started
                      </MuiButton>
                    </MuiCardContent>
                  </MuiCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
        }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                color: 'white',
                mb: 2
              }}>
                Ready to Transform Your Learning?
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 4,
                lineHeight: 1.6
              }}>
                Join thousands of learners who are already achieving their goals with AI-powered education.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                <MuiButton
                  component={Link}
                  href="/signup"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight />}
                  sx={{
                    bgcolor: 'white',
                    color: '#1e3a8a',
                    '&:hover': { bgcolor: '#f8fafc' },
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Start Your Journey
                </MuiButton>
                <MuiButton
                  component={Link}
                  href="/learn"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Learn More
                </MuiButton>
              </Box>
            </Box>
          </Container>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Brain className="w-6 h-6 text-white" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    AI Learning Assistant
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#9ca3af', lineHeight: 1.6 }}>
                  Empowering learners worldwide with AI-powered education tools.
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Features</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Study Plans', 'Quiz Generator', 'Interview Prep', 'Dashboard'].map((item) => (
                    <Link key={item} href={`/${item.toLowerCase().replace(' ', '')}`} style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" sx={{ 
                        color: '#9ca3af', 
                        '&:hover': { color: 'white' },
                        transition: 'color 0.2s ease',
                        cursor: 'pointer'
                      }}>
                        {item}
                      </Typography>
                    </Link>
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Account</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Sign In', 'Sign Up', 'Dashboard'].map((item) => (
                    <Link key={item} href={`/${item.toLowerCase().replace(' ', '')}`} style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" sx={{ 
                        color: '#9ca3af', 
                        '&:hover': { color: 'white' },
                        transition: 'color 0.2s ease',
                        cursor: 'pointer'
                      }}>
                        {item}
                      </Typography>
                    </Link>
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Support</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                    <Typography key={item} variant="body2" sx={{ 
                      color: '#9ca3af', 
                      '&:hover': { color: 'white' },
                      transition: 'color 0.2s ease',
                      cursor: 'pointer'
                    }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ 
              borderTop: 1, 
              borderColor: '#374151', 
              mt: 6, 
              pt: 6, 
              textAlign: 'center' 
            }}>
              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                &copy; 2024 AI Learning Assistant. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </footer>
      </div>
    </ThemeProvider>
  );
}