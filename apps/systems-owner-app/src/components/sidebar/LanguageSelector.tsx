'use client';

import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Translate as TranslateIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLocales } from '../../i18n/use-locales';
import styles from './Sidebar.module.scss';

const LanguageSelector = () => {
  const { t } = useTranslation('common');
  const { allLangs, currentLang } = useLocales();
  const locales = allLangs.map(lang => lang.language_code);
  const localeNames = allLangs.map(lang => lang.name);
  const { i18n } = useTranslation();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (newLocale: string) => {
    try {
      i18n.changeLanguage(newLocale);
      handleCloseMenu();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <>
      <Tooltip title={t('language')} arrow>
        <IconButton 
          onClick={handleOpenMenu} 
          className={styles.iconButton}
          aria-label="change language"
        >
          <TranslateIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        id="language-menu"
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
        {locales.map((loc, i) => (
          <MenuItem
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            selected={loc === currentLang}
            className={`${styles.menuItem} ${loc === currentLang ? styles.selected : ''}`}
          >
            <Typography>{localeNames[i]}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;