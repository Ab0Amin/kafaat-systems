'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Box,
  Drawer,
  Toolbar,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { useLocales } from '../../i18n/use-locales';
import { AUTH_STATUS } from '../../app/api/auth/auth.types';
import { routes } from '../../app/routes';
import styles from './Sidebar.module.scss';
import Header from './Header';
import Nav from './Nav';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const { currentDirection } = useLocales();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [open, setOpen] = useState(!isMobile);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === AUTH_STATUS.UNAUTHENTICATED) {
      router.push(routes.login.path);
    }
  }, [status, router]);

  // Handle drawer state on screen size change
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box className={styles.container}>
      <Header isOpen={open} onToggle={handleDrawerToggle} />
      
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
          <Nav isOpen={open} />
        </Drawer>
      )}

      <Box 
        component="main" 
        className={`${styles.content} ${open ? styles.contentShift : ''}`}
      >
        <Toolbar />
        <Box className={styles.contentInner}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}