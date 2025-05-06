'use client';

import { useState, useEffect } from 'react';
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
import { useLocales } from '../../i18n/use-locales';
import styles from './Sidebar.module.scss';
import { routes } from '../../app/routes';
import { AUTH_STATUS } from '../../app/api/auth/auth.types';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('common');
  const { allLangs } = useLocales();
  const locales = allLangs.map(lang => lang.language_code);
  const locale = useLocales().currentLang;
  const currentDirection = useLocales().currentDirection;
  const localeNames = allLangs.map(lang => lang.name);
  const { t: dashboardT, i18n } = useTranslation('dashboard');
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { mode, setMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [open, setOpen] = useState(!isMobile);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const [anchorElTheme, setAnchorElTheme] = useState<null | HTMLElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === AUTH_STATUS.UNAUTHENTICATED) {
      router.push(routes.login.path);
    }
  }, [status, router]);

  const handleDrawerToggle = () => {
    setOpen(!open);
    console.log(open);
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
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    await signOut({
      redirect: true,
      callbackUrl: `${baseUrl}${routes.login.path}`,
    });
  };

  const handleLanguageChange = async (newLocale: string) => {
    try {
      i18n.changeLanguage(newLocale);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    handleCloseThemeMenu();
  };

  const menuItems = [
    {
      text: dashboardT('welcome'),
      icon: <DashboardIcon />,
      path: routes.dashboard.path,
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
    <Box className={styles.container}>
      <AppBar position="fixed" className={`${styles.appBar} ${open ? styles.appBarShift : ''}`}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={styles.menuButton}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" className={styles.title}>
            {t('app.title')}
          </Typography>

          {/* Language Selector */}
          <Tooltip title={t('language')}>
            <IconButton onClick={handleOpenLangMenu} className={styles.iconButton}>
              <TranslateIcon />
            </IconButton>
          </Tooltip>
          <Menu
            className={styles.menu}
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
            {locales.map((loc, i) => (
              <MenuItem
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                selected={loc === locale}
                className={loc === locale ? styles.selected : ''}
              >
                <Typography textAlign="center">{localeNames[i]}</Typography>
              </MenuItem>
            ))}
          </Menu>

          {/* Theme Selector */}
          <Tooltip title={t('theme')}>
            <IconButton onClick={handleOpenThemeMenu} className={styles.iconButton}>
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
            className={styles.menu}
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
              className={mode === 'light' ? styles.selected : ''}
            >
              <ListItemIcon>
                <LightModeIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">{t('light')}</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleThemeChange('dark')}
              selected={mode === 'dark'}
              className={mode === 'dark' ? styles.selected : ''}
            >
              <ListItemIcon>
                <DarkModeIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">{t('dark')}</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleThemeChange('system')}
              selected={mode === 'system'}
              className={mode === 'system' ? styles.selected : ''}
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
                <Avatar alt={session?.user?.name || 'User'} src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              className={styles.menu}
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
      {open && (
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          anchor={currentDirection === 'rtl' ? 'right' : 'left'}
          open={open}
          onClose={isMobile ? handleDrawerToggle : undefined}
          className={styles.drawer}
          classes={{
            paper: styles.drawerPaper,
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', mt: 2 }}>
            <List>
              {menuItems.map(item => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={pathname === item.path}
                    onClick={() => router.push(item.path)}
                    className={pathname === item.path ? styles.selected : ''}
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
      )}

      <Box component="main" className={`${styles.content} ${open ? styles.contentShift : ''}`}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
