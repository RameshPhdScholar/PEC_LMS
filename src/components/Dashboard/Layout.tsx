import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  EventNote as LeaveIcon,
  People as PeopleIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  BarChart as AnalyticsIcon,
  Domain as DomainIcon,
} from '@mui/icons-material';
import { UserRole } from '@/types';

const drawerWidth = 260;

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);
  const [hodDepartment, setHodDepartment] = useState<string>('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  // Fetch department information for HOD users
  useEffect(() => {
    const fetchHodDepartment = async () => {
      if (session?.user?.role_id === UserRole.HOD && session?.user?.email) {
        try {
          const response = await axios.get(`/api/users?email=${session.user.email}`);
          const userData = response.data.data;
          if (userData && userData.length > 0) {
            const user = userData[0];
            if (user.department_name) {
              setHodDepartment(user.department_name);
            }
          }
        } catch (error) {
          console.error('Error fetching HOD department:', error);
        }
      }
    };

    fetchHodDepartment();
  }, [session]);

  const handleNavigate = (path: string) => {
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const items = [
      {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard',
        roles: [UserRole.Employee, UserRole.HOD, UserRole.Principal, UserRole.Admin, UserRole.SuperAdmin],
      },
      {
        text: 'Leave Approvals',
        icon: <LeaveIcon />,
        path: '/leaves/approvals',
        roles: [UserRole.HOD, UserRole.Principal],
      },
      {
        text: 'Department Leave History',
        icon: <LeaveIcon />,
        path: '/leaves/department-leaves',
        roles: [UserRole.HOD],
      },
      {
        text: 'All Leaves',
        icon: <LeaveIcon />,
        path: '/leaves/all',
        roles: [UserRole.Admin, UserRole.SuperAdmin],
      },
      {
        text: 'Leave Balances',
        icon: <LeaveIcon />,
        path: '/leaves/balances',
        roles: [UserRole.Admin, UserRole.SuperAdmin],
      },
      {
        text: 'Leave Allocation',
        icon: <SettingsIcon />,
        path: '/admin/leave-allocation',
        roles: [UserRole.Admin, UserRole.SuperAdmin],
      },
      {
        text: 'Employees',
        icon: <PeopleIcon />,
        path: '/employees',
        roles: [UserRole.Admin, UserRole.SuperAdmin],
      },
      {
        text: 'Departments',
        icon: <DomainIcon />,
        path: '/departments',
        roles: [UserRole.Admin, UserRole.SuperAdmin],
      },
      {
        text: 'Reports',
        icon: <ReportIcon />,
        path: '/reports',
        roles: [UserRole.HOD, UserRole.Principal, UserRole.Admin, UserRole.SuperAdmin],
      },
      {
        text: 'My Profile',
        icon: <PersonIcon />,
        path: '/profile',
        roles: [UserRole.Employee],
      },
      {
        text: 'Analytics',
        icon: <AnalyticsIcon />,
        path: '/analytics',
        roles: [UserRole.Admin, UserRole.SuperAdmin],
      },
      {
        text: 'Settings',
        icon: <SettingsIcon />,
        path: '/settings',
        roles: [UserRole.Admin, UserRole.SuperAdmin],
      },
    ];

    // Filter navigation items based on user role
    return items.filter(item => {
      if (!session?.user) return false;
      return item.roles.includes(session.user.role_id);
    });
  };

  const drawer = (
    <Box>
      {/* Enhanced User Profile Section */}
      <Box
        sx={{
          p: 3.5,
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
          borderRadius: 2,
          m: 1.5,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite',
          },
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          }
        }}
      >
        {/* Enhanced Avatar with Gradient and Animation */}
        <Box
          sx={{
            position: 'relative',
            display: 'inline-block',
            mb: 2.5,
          }}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
              mx: 'auto',
              background: session?.user?.role_id === UserRole.SuperAdmin
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : session?.user?.role_id === UserRole.Admin
                ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                : session?.user?.role_id === UserRole.Principal
                ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                : session?.user?.role_id === UserRole.HOD
                ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              fontSize: '2.2rem',
              fontWeight: 'bold',
              color: 'white',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(25, 118, 210, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px) scale(1.05)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(25, 118, 210, 0.3)',
              }
            }}
          >
            {session?.user?.isAdminUser
              ? session?.user?.email?.charAt(0).toUpperCase() || ''
              : session?.user?.name?.charAt(0) || ''}
          </Avatar>

          {/* Status Indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              width: 16,
              height: 16,
              bgcolor: '#4caf50',
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              }
            }}
          />
        </Box>

        {/* Enhanced Role Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            background: session?.user?.role_id === UserRole.SuperAdmin
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : session?.user?.role_id === UserRole.Admin
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : session?.user?.role_id === UserRole.Principal
              ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              : session?.user?.role_id === UserRole.HOD
              ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
              : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          {/* Role Icon */}
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}
          >
            {session?.user?.role_id === UserRole.SuperAdmin && '★'}
            {session?.user?.role_id === UserRole.Admin && '⚡'}
            {session?.user?.role_id === UserRole.Principal && '👑'}
            {session?.user?.role_id === UserRole.HOD && '🎯'}
            {session?.user?.role_id === UserRole.Employee && '👤'}
          </Box>

          {/* Role Text */}
          <span>
            {session?.user?.role_id === UserRole.Employee && session?.user?.name}
            {session?.user?.role_id === UserRole.HOD && (hodDepartment || 'HOD')}
            {session?.user?.role_id === UserRole.Principal && 'Principal'}
            {session?.user?.role_id === UserRole.Admin && 'Administrator'}
            {session?.user?.role_id === UserRole.SuperAdmin && 'Super Administrator'}
          </span>
        </Box>
      </Box>
      <Divider />
      <List>
        {getNavigationItems().map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={router.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: router.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleSignOut}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title || 'Leave Management System'}
          </Typography>

          {/* Notifications */}
          <Box sx={{ flexGrow: 0, mr: 2 }}>
            <Tooltip title="Notifications">
              <IconButton onClick={handleOpenNotificationsMenu} sx={{ p: 0, color: 'white' }}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-notifications"
              anchorEl={anchorElNotifications}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotificationsMenu}
            >
              <MenuItem onClick={handleCloseNotificationsMenu}>
                <Typography textAlign="center">No new notifications</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Enhanced User Menu */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.7,
                  background: 'rgba(255, 255, 255, 0.18)',
                  color: 'white',
                  px: 1.2,
                  py: 0.4,
                  borderRadius: 1.2,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.22)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {session?.user?.role_id === UserRole.SuperAdmin && '★'}
                  {session?.user?.role_id === UserRole.Admin && '⚡'}
                  {session?.user?.role_id === UserRole.Principal && '👑'}
                  {session?.user?.role_id === UserRole.HOD && '🎯'}
                  {session?.user?.role_id === UserRole.Employee && '👤'}
                </Box>
                <span style={{ letterSpacing: '0.4px' }}>
                  {session?.user?.role_id === UserRole.Employee && session?.user?.name}
                  {session?.user?.role_id === UserRole.HOD && (hodDepartment || 'HOD')}
                  {session?.user?.role_id === UserRole.Principal && 'Principal'}
                  {session?.user?.role_id === UserRole.Admin && 'Admin'}
                  {session?.user?.role_id === UserRole.SuperAdmin && 'Super Admin'}
                </span>
              </Box>
            </Box>
            <Tooltip title="User menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                <Avatar
                  alt={session?.user?.isAdminUser
                    ? session?.user?.email?.split('@')[0] || 'Admin User'
                    : session?.user?.name || 'User'}
                  sx={{
                    width: 46,
                    height: 46,
                    background: session?.user?.role_id === UserRole.SuperAdmin
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : session?.user?.role_id === UserRole.Admin
                      ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                      : session?.user?.role_id === UserRole.Principal
                      ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                      : session?.user?.role_id === UserRole.HOD
                      ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                      : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    border: '3px solid rgba(255, 255, 255, 0.4)',
                    fontSize: '1.15rem',
                    fontWeight: 'bold',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.08) translateY(-1px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)',
                      border: '3px solid rgba(255, 255, 255, 0.6)',
                    }
                  }}
                >
                  {session?.user?.isAdminUser
                    ? session?.user?.email?.charAt(0).toUpperCase() || ''
                    : session?.user?.name?.charAt(0) || ''}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Box sx={{ px: 2, py: 2, display: { xs: 'block', sm: 'none' } }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5
                  }}
                >
                  {session?.user?.isAdminUser
                    ? session?.user?.email?.split('@')[0] || 'Admin User'
                    : session?.user?.name || 'User'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 1,
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }}
                >
                  {session?.user?.email || ''}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    background: session?.user?.role_id === UserRole.SuperAdmin
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : session?.user?.role_id === UserRole.Admin
                      ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                      : session?.user?.role_id === UserRole.Principal
                      ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                      : session?.user?.role_id === UserRole.HOD
                      ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                      : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: 'white',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <span style={{ fontSize: '0.7rem' }}>
                    {session?.user?.role_id === UserRole.SuperAdmin && '★'}
                    {session?.user?.role_id === UserRole.Admin && '⚡'}
                    {session?.user?.role_id === UserRole.Principal && '👑'}
                    {session?.user?.role_id === UserRole.HOD && '🎯'}
                    {session?.user?.role_id === UserRole.Employee && '👤'}
                  </span>
                  <span>
                    {session?.user?.role_id === UserRole.Employee && session?.user?.name}
                    {session?.user?.role_id === UserRole.HOD && (hodDepartment || 'HOD')}
                    {session?.user?.role_id === UserRole.Principal && 'Principal'}
                    {session?.user?.role_id === UserRole.Admin && 'Administrator'}
                    {session?.user?.role_id === UserRole.SuperAdmin && 'Super Administrator'}
                  </span>
                </Box>
              </Box>
              <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
