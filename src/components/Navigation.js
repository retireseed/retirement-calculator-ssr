import React, { useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navigation() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Home', href: '/' },
    { text: 'Retirement Calculator', href: '/retirement-calculator' },
    { text: 'Blog', href: 'https://blog.retireseed.com' },
    { text: 'Privacy Policy', href: '/privacy' },
  ];

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Retireseed
        </Typography>
        {isMobile ? (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {menuItems.map((item) => (
              <Button 
                key={item.text} 
                color="inherit" 
                component={Link} 
                href={item.href} 
                sx={{ 
                  whiteSpace: 'nowrap',
                  textTransform: 'none',
                  ml: 2,
                  '&:first-of-type': { ml: 0 }
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {menuItems.map((item) => (
            <MenuItem key={item.text} onClick={handleClose} component={Link} href={item.href}>
              {item.text}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}