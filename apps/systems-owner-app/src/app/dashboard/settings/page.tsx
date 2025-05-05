'use client';

import { useState } from 'react';

import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Button,
  Alert,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Translate as TranslateIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { useTheme } from '../../../components/providers/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useLocales } from '../../../i18n/use-locales';

export default function SettingsPage() {
  const { t ,i18n} = useTranslation('common');
  const { t: dashboardT } = useTranslation('dashboard');
  const { mode, setMode } = useTheme();
  const { allLangs } = useLocales();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
const localeNAmes = allLangs.map((lang) => lang.name);
  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.checked ? 'dark' : 'light');
  };

  const handleLanguageChange = (newLocale: string) => {
    i18n.changeLanguage(newLocale);
  };

  const handleNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationsEnabled(event.target.checked);
  };

  const handleSaveSettings = () => {
    // In a real app, you would save these settings to the backend
    setSaveSuccess(true);
    
    // Hide the success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {dashboardT('settings')}
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3, mt: 3 }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText
              primary={t('theme')}
              secondary={mode === 'dark' ? t('dark') : t('light')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={mode === 'dark'}
                  onChange={handleThemeChange}
                  color="primary"
                />
              }
              label=""
            />
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <TranslateIcon />
            </ListItemIcon>
            <ListItemText
              primary={t('language')}
              secondary={localeNAmes}
            />
            <Box>
              <Button
                variant={i18n.language === 'en' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleLanguageChange('en')}
                sx={{ mr: 1 }}
              >
                English
              </Button>
              <Button
                variant={i18n.language === 'ar' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleLanguageChange('ar')}
              >
                العربية
              </Button>
            </Box>
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Notifications"
              secondary="Enable or disable system notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={handleNotificationsChange}
                  color="primary"
                />
              }
              label=""
            />
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Security"
              secondary="Manage security settings and permissions"
            />
            <Button variant="outlined" size="small">
              Manage
            </Button>
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText
              primary="Database"
              secondary="Run migrations and manage database settings"
            />
            <Button variant="outlined" size="small">
              Manage
            </Button>
          </ListItem>
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
          >
            {t('save')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}