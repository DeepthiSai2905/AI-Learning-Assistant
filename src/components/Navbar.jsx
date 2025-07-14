'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button as MuiButton,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Work as WorkIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { Brain } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const theme = createTheme({
    palette: {
      primary: { main: '#1e3a8a' },
      secondary: { main: '#64748b' },
      background: { default: '#ffffff' },
      text: { primary: '#1e293b', secondary: '#64748b' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
    },
  });

  const navigationItems = [
    { text: 'Study Plans', icon: <SchoolIcon />, href: '/learn' },
    { text: 'Quiz Generator', icon: <QuizIcon />, href: '/quiz' },
    { text: 'Interview Prep', icon: <WorkIcon />, href: '/interview' },
    { text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#1e3a8a', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          AI Learning Assistant
        </Typography>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            href={item.href}
            selected={pathname === item.href}
            sx={{ 
              '&:hover': { 
                bgcolor: '#f1f5f9',
                borderLeft: '4px solid #1e3a8a'
              },
              '&.Mui-selected': {
                bgcolor: '#f1f5f9',
                borderLeft: '4px solid #1e3a8a'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#1e3a8a' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: '#1e293b' }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          background: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #e2e8f0',
          zIndex: 1200
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' }, color: '#1e3a8a' }}
              >
                <MenuIcon />
              </IconButton>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      background: '#1e3a8a',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(30, 58, 138, 0.2)'
                    }}
                  >
                    <Brain className="w-6 h-6 text-white" />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#1e3a8a'
                    }}
                  >
                    AI Learning Assistant
                  </Typography>
                </Box>
              </Link>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navigationItems.map((item) => (
                <MuiButton
                  key={item.text}
                  component={Link}
                  href={item.href}
                  startIcon={item.icon}
                  sx={{
                    color: pathname === item.href ? '#1e3a8a' : '#64748b',
                    mx: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    bgcolor: pathname === item.href ? '#f1f5f9' : 'transparent',
                    '&:hover': {
                      background: '#f1f5f9',
                      color: '#1e3a8a',
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  {item.text}
                </MuiButton>
              ))}
            </Box>

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
              <MuiButton
                component={Link}
                href="/login"
                startIcon={<LoginIcon />}
                variant="outlined"
                sx={{
                  color: '#1e3a8a',
                  borderColor: '#1e3a8a',
                  '&:hover': {
                    borderColor: '#1e40af',
                    background: '#f8fafc'
                  }
                }}
              >
                Sign In
              </MuiButton>
              <MuiButton
                component={Link}
                href="/signup"
                startIcon={<PersonAddIcon />}
                variant="contained"
                sx={{
                  background: '#1e3a8a',
                  color: 'white',
                  '&:hover': {
                    background: '#1e40af',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
                  }
                }}
              >
                Get Started
              </MuiButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar />
    </ThemeProvider>
  );
} 