import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  ColorLens as ThemeIcon,
  Email as EmailIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/Dashboard/Layout';
import { UserRole } from '@/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [systemEmail, setSystemEmail] = useState('admin@pallaviengineeringcollege.ac.in');
  const [leaveApprovalFlow, setLeaveApprovalFlow] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Only admins can access settings
    if (session && ![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess('Settings saved successfully!');
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1000);
  };

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings">
      <Head>
        <title>Settings | Leave Management System</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              System Settings
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="settings tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<SettingsIcon />} label="General" {...a11yProps(0)} />
                <Tab icon={<NotificationsIcon />} label="Notifications" {...a11yProps(1)} />
                <Tab icon={<SecurityIcon />} label="Security" {...a11yProps(2)} />
                <Tab icon={<ThemeIcon />} label="Appearance" {...a11yProps(3)} />
                <Tab icon={<EmailIcon />} label="Email Settings" {...a11yProps(4)} />
              </Tabs>
            </Box>

            {/* General Settings */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Leave Approval Settings
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={leaveApprovalFlow}
                            onChange={(e) => setLeaveApprovalFlow(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Enable HOD → Principal approval flow"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        When enabled, leave applications will follow the standard approval flow: Employee → HOD → Principal
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Notifications Settings */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Email Notifications
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Send email notifications"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        When enabled, the system will send email notifications for leave applications, approvals, and rejections.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Security Settings */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Security settings will be implemented in a future update.
              </Typography>
            </TabPanel>

            {/* Appearance Settings */}
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Theme Settings
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={darkMode}
                            onChange={(e) => setDarkMode(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Dark Mode (Coming Soon)"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Email Settings */}
            <TabPanel value={tabValue} index={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        System Email Configuration
                      </Typography>
                      <TextField
                        fullWidth
                        label="System Email Address"
                        value={systemEmail}
                        onChange={(e) => setSystemEmail(e.target.value)}
                        margin="normal"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This email will be used as the sender for all system-generated emails.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}
