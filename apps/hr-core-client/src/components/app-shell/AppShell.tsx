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
  IconButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useLocales } from '../../i18n/use-locales';
import Nav from '../nav/Nav';
import Header from '../header/Header';
import styles from './AppShell.module.scss';
import { routes } from '../../app/routes';
import { AUTH_STATUS } from '../../app/api/auth/auth.types';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const currentDirection = useLocales().currentDirection;

  const [open, setOpen] = useState(!isMobile);
  const [collapsed, setCollapsed] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === AUTH_STATUS.UNAUTHENTICATED && window.location.pathname !== routes.login.path) {
      router.push(routes.login.path);
    }
  }, [status, router]);

  // Handle responsive drawer
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed);
  };

  const drawerWidth = collapsed ? 72 : 240;

  return (
    <Box
      className={styles.container}
      sx={{
        display: 'flex',
        flexDirection: currentDirection === 'rtl' ? 'row-reverse' : 'row',
      }}
    >
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      {status === AUTH_STATUS.AUHTHENTICATED && (
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          anchor={currentDirection === 'rtl' ? 'right' : 'left'}
          open={open}
          onClose={isMobile ? handleDrawerToggle : undefined}
          className={`${styles.drawer} ${collapsed ? styles.drawerCollapsed : ''}`}
          classes={{
            paper: `${styles.drawerPaper} ${collapsed ? styles.drawerPaperCollapsed : ''}`,
          }}
          sx={{
            width: open ? drawerWidth : 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px dashed rgba(145, 158, 171, 0.2)',
              boxShadow: 'none',
              transition: 'width 0.2s ease-in-out',
              left: currentDirection === 'rtl' ? 'auto' : 0,
              right: currentDirection === 'rtl' ? 0 : 'auto',
            },
          }}
        >
          <Toolbar />
          <Box className={styles.drawerContainer}>
            <Nav collapsed={collapsed} />

            {!isMobile && (
              <IconButton onClick={handleCollapseToggle} className={styles.collapseButton}>
                {currentDirection === 'rtl' ? (
                  collapsed ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )
                ) : collapsed ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            )}
          </Box>
        </Drawer>
      )}

      <Box
        component="main"
        className={`${styles.content} `}
        sx={{
          backgroundColor: theme => theme.palette.background.default,
          color: theme => theme.palette.text.primary,
          flexGrow: 1,
          minHeight: '100vh',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Toolbar />
        <Box className={styles.contentContainer}>{children}</Box>
      </Box>
    </Box>
  );
}
