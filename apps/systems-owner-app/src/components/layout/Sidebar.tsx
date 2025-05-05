'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Translate as TranslateIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  BrightnessAuto as SystemModeIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useTheme } from '../providers/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { use } from 'passport';
import { useLocales } from '../../i18n/use-locales';

const drawerWidth = 240;

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const {t,i18n} = useTranslation('common');
  const { allLangs } = useLocales();
  const locales = allLangs.map((lang) => lang.language_code);
  const locale = i18n.language;
  const localeNames = allLangs.map((lang) => lang.name);
  const {t:dashboardT} = useTranslation('dashboard');
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  // const locale = useLocale();
  const { mode, setMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [open, setOpen] = useState(!isMobile);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const [anchorElTheme, setAnchorElTheme] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  const handleOpenThemeMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTheme(event.currentTarget);
  };

  const handleCloseThemeMenu = () => {
    setAnchorElTheme(null);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  const handleLanguageChange = (newLocale: string) => {
i18n
    .changeLanguage(newLocale)
    .then(() => {
      handleCloseLangMenu();
    })
    .catch((error) => {
      console.error('Error changing language:', error);
    });
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    handleCloseThemeMenu();
  };

  const menuItems = [
    {
      text: dashboardT('welcome'),
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: dashboardT('tenants'),
      icon: <PeopleIcon />,
      path: '/dashboard/tenants',
    },
    {
      text: dashboardT('settings'),
      icon: <SettingsIcon />,
      path: '/dashboard/settings',
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ marginRight: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Kafaat Systems - Owner Dashboard
          </Typography>

          {/* Language Selector */}
          <Tooltip title={t('language')}>
            <IconButton onClick={handleOpenLangMenu} sx={{ p: 1, color: 'white' }}>
              <TranslateIcon />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="language-menu"
            anchorEl={anchorElLang}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElLang)}
            onClose={handleCloseLangMenu}
          >
            {locales.map((loc,i) => (
              <MenuItem
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                selected={loc === locale}
              >
                <Typography textAlign="center">{localeNames[i]}</Typography>
              </MenuItem>
            ))}
          </Menu>

          {/* Theme Selector */}
          <Tooltip title={t('theme')}>
            <IconButton onClick={handleOpenThemeMenu} sx={{ p: 1, color: 'white' }}>
              {mode === 'light' ? (
                <LightModeIcon />
              ) : mode === 'dark' ? (
                <DarkModeIcon />
              ) : (
                <SystemModeIcon />
              )}
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="theme-menu"
            anchorEl={anchorElTheme}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElTheme)}
            onClose={handleCloseThemeMenu}
          >
            <MenuItem
              onClick={() => handleThemeChange('light')}
              selected={mode === 'light'}
            >
              <ListItemIcon>
                <LightModeIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">{t('light')}</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleThemeChange('dark')}
              selected={mode === 'dark'}
            >
              <ListItemIcon>
                <DarkModeIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">{t('dark')}</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleThemeChange('system')}
              selected={mode === 'system'}
            >
              <ListItemIcon>
                <SystemModeIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">{t('system')}</Typography>
            </MenuItem>
          </Menu>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0, ml: 1 }}>
            <Tooltip title={session?.user?.name || 'User'}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={session?.user?.name || 'User'}
                  src="/static/images/avatar/2.jpg"
                />
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
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{t('profile')}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">{t('logout')}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={pathname === item.path}
                  onClick={() => router.push(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: 2 }} />
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { sm: open ? `${drawerWidth}px` : 0 },
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}