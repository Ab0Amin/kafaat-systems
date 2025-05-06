'use client';

import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  BrightnessAuto as SystemModeIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../providers/ThemeProvider';
import styles from './Sidebar.module.scss';

const ThemeSelector = () => {
  const { t } = useTranslation('common');
  const { mode, setMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    handleCloseMenu();
  };

  const getThemeIcon = () => {
    if (mode === 'light') return <LightModeIcon />;
    if (mode === 'dark') return <DarkModeIcon />;
    return <SystemModeIcon />;
  };

  return (
    <>
      <Tooltip title={t('theme')} arrow>
        <IconButton 
          onClick={handleOpenMenu} 
          className={styles.iconButton}
          aria-label="change theme"
        >
          {getThemeIcon()}
        </IconButton>
      </Tooltip>
      
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        className={styles.menu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem
          onClick={() => handleThemeChange('light')}
          selected={mode === 'light'}
          className={`${styles.menuItem} ${mode === 'light' ? styles.selected : ''}`}
        >
          <ListItemIcon className={styles.menuItemIcon}>
            <LightModeIcon fontSize="small" />
          </ListItemIcon>
          <Typography>{t('light')}</Typography>
        </MenuItem>
        
        <MenuItem
          onClick={() => handleThemeChange('dark')}
          selected={mode === 'dark'}
          className={`${styles.menuItem} ${mode === 'dark' ? styles.selected : ''}`}
        >
          <ListItemIcon className={styles.menuItemIcon}>
            <DarkModeIcon fontSize="small" />
          </ListItemIcon>
          <Typography>{t('dark')}</Typography>
        </MenuItem>
        
        <MenuItem
          onClick={() => handleThemeChange('system')}
          selected={mode === 'system'}
          className={`${styles.menuItem} ${mode === 'system' ? styles.selected : ''}`}
        >
          <ListItemIcon className={styles.menuItemIcon}>
            <SystemModeIcon fontSize="small" />
          </ListItemIcon>
          <Typography>{t('system')}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ThemeSelector;