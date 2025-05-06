'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { routes } from '../../app/routes';
import styles from './Sidebar.module.scss';

interface NavProps {
  isOpen: boolean;
}

export const Nav = ({ isOpen }: NavProps) => {
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

  if (!isOpen) return null;

  return (
    <Box className={styles.navContainer}>
      <List>
        {menuItems.map(item => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
              className={`${styles.navItem} ${pathname === item.path ? styles.selected : ''}`}
            >
              <ListItemIcon className={styles.navIcon}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} className={styles.navText} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider className={styles.navDivider} />
    </Box>
  );
};

export default Nav;