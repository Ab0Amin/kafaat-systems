'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { routes } from '../../app/routes';
import styles from './Sidebar.module.scss';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Header = ({ isOpen, onToggle }: HeaderProps) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    await signOut({
      redirect: true,
      callbackUrl: `${baseUrl}${routes.login.path}`,
    });
  };

  return (
    <AppBar position="fixed" className={`${styles.appBar} ${isOpen ? styles.appBarShift : ''}`}>
      <Toolbar className={styles.toolbar}>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={onToggle}
          className={styles.menuButton}
        >
          {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" className={styles.title}>
          {t('app.title')}
        </Typography>

        <Box className={styles.headerActions}>
          <LanguageSelector />
          <ThemeSelector />

          {/* User Menu */}
          <Box className={styles.userMenuContainer}>
            <Tooltip title={session?.user?.name || 'User'}>
              <IconButton onClick={handleOpenUserMenu} className={styles.avatarButton}>
                <Avatar 
                  alt={session?.user?.name || 'User'} 
                  src="/static/images/avatar/2.jpg"
                  className={styles.avatar}
                />
              </IconButton>
            </Tooltip>
            <Menu
              id="user-menu"
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              className={styles.menu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleCloseUserMenu} className={styles.menuItem}>
                <Typography>{t('profile')}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout} className={styles.menuItem}>
                <Typography>{t('logout')}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;