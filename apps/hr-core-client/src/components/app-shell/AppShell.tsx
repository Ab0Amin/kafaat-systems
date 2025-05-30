'use client';

import { useState, useEffect } from 'react';
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
import { AUTH_STATUS } from '../../app/api/auth/auth.types';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const currentDirection = useLocales().currentDirection;

  const [open, setOpen] = useState(!isMobile);
  const [collapsed, setCollapsed] = useState(false);

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
      {status == AUTH_STATUS.AUHTHENTICATED && (
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
            flexShrink: 0,
            zIndex: 1,
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: currentDirection === 'rtl' ? 'auto' : 0,
            right: currentDirection === 'rtl' ? 0 : 'auto',
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight:
                currentDirection === 'rtl' ? 'none' : '1px dashed rgba(145, 158, 171, 0.2)',
              borderLeft:
                currentDirection === 'rtl' ? '1px dashed rgba(145, 158, 171, 0.2)' : 'none',
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
        className={`${styles.content} ${open ? styles.contentShift : ''}`}
        sx={{
          backgroundColor: theme => theme.palette.background.default,
          color: theme => theme.palette.text.primary,
          flexGrow: 1,
          minHeight: '100vh',
          transition: 'background-color 0.3s ease, margin 0.2s ease-in-out, width 0.2s ease-in-out',

          marginLeft: open && currentDirection === 'ltr' ? `${drawerWidth}px` : 0,
          marginRight: open && currentDirection === 'rtl' ? `${drawerWidth}px` : 0,
        }}
      >
        <Toolbar />
        <Box className={styles.contentContainer}>{children}</Box>
      </Box>
    </Box>
  );
}
