import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (session) {
      // Redirect to appropriate dashboard based on user role
      router.push('/dashboard');
    } else {
      // Redirect to login page if not authenticated
      router.push('/login');
    }
  }, [session, status, router]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" mt={3} color="text.secondary">
        Redirecting...
      </Typography>
    </Box>
  );
}
