'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import styles from './Nav.module.scss';
import { routes } from '../../app/routes';

interface NavProps {
  collapsed?: boolean;
}

export default function Nav({ collapsed = false }: NavProps) {
  const { t } = useTranslation('dashboard');
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      text: t('welcome'),
      icon: <DashboardIcon />,
      path: routes.dashboard.path,
    },
    {
      text: t('tenants'),
      icon: <PeopleIcon />,
      path: '/dashboard/tenants',
    },
    {
      text: t('settings'),
      icon: <SettingsIcon />,
      path: '/dashboard/settings',
    },
  ];

  return (
    <Box sx={{ overflow: 'auto', mt: 2 }} className={styles.navContainer}>
      <List component="nav" disablePadding className={styles.navList}>
        {menuItems.map(item => (
          <ListItem key={item.text} disablePadding className={styles.navItem}>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
              className={`${styles.navButton} ${pathname === item.path ? styles.active : ''}`}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? 'center' : 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                className={styles.navIcon}
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 'auto' : 3,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} className={styles.navText} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
