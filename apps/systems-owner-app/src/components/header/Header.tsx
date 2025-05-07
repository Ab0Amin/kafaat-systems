'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Box,
  Badge,
  ListItemIcon,
} from '@mui/material';
import {
  Translate as TranslateIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  BrightnessAuto as SystemModeIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTheme } from '../providers/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useLocales } from '../../i18n/use-locales';
import styles from './Header.module.scss';
import { routes } from '../../app/routes';
import { AUTH_STATUS } from '../../app/api/auth/auth.types';

interface HeaderProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

export default function Header({ open, handleDrawerToggle }: HeaderProps) {
  const { t } = useTranslation('common');
  const { allLangs } = useLocales();
  const locales = allLangs.map(lang => lang.language_code);
  const locale = useLocales().currentLang;
  const localeNames = allLangs.map(lang => lang.name);
  const { i18n } = useTranslation();
  const { data: session, status } = useSession();
  const { mode, setMode } = useTheme();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const [anchorElTheme, setAnchorElTheme] = useState<null | HTMLElement>(null);

  const isAuthenticated = status === AUTH_STATUS.AUHTHENTICATED;

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
    handleCloseUserMenu();
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    await signOut({
      redirect: true,
      callbackUrl: `${baseUrl}${routes.login.path}`,
    });
  };

  const handleLanguageChange = async (newLocale: string) => {
    try {
      i18n.changeLanguage(newLocale);
      handleCloseLangMenu();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    handleCloseThemeMenu();
  };

  return (
    <AppBar position="fixed" className={`${styles.appBar} ${open ? styles.appBarShift : ''}`}>
      <Toolbar className={styles.toolbar}>
        <Typography variant="h6" noWrap component="div" className={styles.title}>
          {t('app.title')}
        </Typography>

        <Box className={styles.headerActions}>
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
              vertical: 'bottom',
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
              vertical: 'bottom',
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

          {/* Notifications */}
          {isAuthenticated && (
            <Tooltip title={t('notifications')}>
              <IconButton className={styles.iconButton}>
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <Box className={styles.userMenu}>
              <Tooltip title={session?.user?.name || 'User'}>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0 }}
                  className={styles.avatarButton}
                >
                  <Avatar
                    alt={session?.user?.name || 'User'}
                    src={session?.user?.image || '/static/images/avatar/default.jpg'}
                    className={styles.avatar}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                className={styles.menu}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'bottom',
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
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">{t('profile')}</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">{t('settings')}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">{t('logout')}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Tooltip title={t('login')}>
              <IconButton
                className={styles.iconButton}
                onClick={() => (window.location.href = routes.login.path)}
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
