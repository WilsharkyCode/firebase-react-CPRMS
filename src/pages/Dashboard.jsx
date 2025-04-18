import React from 'react'

//For MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


//From React
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { auth  } from '../config/firebase-config';
import { signOut } from 'firebase/auth';
import DrawerContent from '../components/MaterialUI/SidebarModule';

//controls the width of the sidebar drawer
const drawerWidth = 280;

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  //Imports Sidebar
  const drawer = <DrawerContent />;
  const Nav = useNavigate();


  const handleSignOut =() => {
      signOut(auth).then(() => {
          // Sign-out successful.
          console.log("Sign out successful")
        }).catch((error) => {
          // An error happened.
        });;
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };



  return (
    <Box sx={{ display: 'flex', flexGrow: 1  }}>
      <CssBaseline />
      <AppBar
      className='bg-sky-400'
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="gray"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {/*Change with dynamic text next time*/}
          
          <Typography variant="h6" className='text-slate-50' noWrap component="div" sx={{ flexGrow:1, display: { xs: 'none', sm: 'block' }}}>
            Dashboard
          </Typography>
          <Button onClick={handleSignOut} className='text-slate-50 hover:text-red-700' sx={{ display: { xs: 'none', sm: 'block' }}} >Log Out</Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        className='bg-slate-100 overflow-y-auto h-dvh'
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }}}
      >
        <Toolbar />
        {/*Main Content Start===============================================================*/}
        <div >
          <Toolbar className="flex items-baseline justify-between w-full flex-wrap gap-4 px-4">
          
          </Toolbar>
        </div>
        {/*Main Content End=================================================================*/}
      </Box>
    </Box>
  );
}



