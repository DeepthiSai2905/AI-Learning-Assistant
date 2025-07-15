'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, CircularProgress, createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#1e3a8a' },
    background: { default: '#fff' },
    text: { primary: '#1e293b', secondary: '#64748b' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function SignupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 2 seconds
    const timer = setTimeout(() => {
      router.push('/auth/signup'); // Change this to your actual signup route if needed
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress color="primary" sx={{ mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Redirecting to Signup...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we take you to the signup page.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
} 