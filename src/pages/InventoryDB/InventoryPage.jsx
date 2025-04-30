import * as React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { database, auth } from '../../config/firebase-config';
import { signOut } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';

import DrawerContent from '../../components/MaterialUI/SidebarModule';
import InventoryTable from './InventoryTable';

const drawerWidth = 280;

export default function InventoryPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const itemsRef = ref(database, 'Inventory/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedItems = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setData(loadedItems);
      setIsLoading(false);
    });
  }, []);

  const handleDrawerToggle = () => {
    if (!isClosing) setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };



  const handleSignOut =() => {
      signOut(auth).then(() => {
          // Sign-out successful.
          console.log("Sign out successful")
        }).catch((error) => {
          // An error happened.
        });;
  };



  const handleAddItemCategory = useCallback((e) => {
    e.preventDefault()
    navigate('/inventory/additemcategory');
  }, [navigate]);

  const handleDeleteItemCategory = useCallback((e) => {
    e.preventDefault()
    navigate('/inventory/deleteitemcategory');
  }, [navigate]);

  const handleAddInventory = useCallback((e) => {
    e.preventDefault();
    navigate("/inventory/addinventory");
  }, [navigate]);

  //Search Controls
  const keys = ['itemName',
    "supplierName",
    "itemCategory",
    "branchName",
    "dateBought"];
  const handleSearchQuery = (data) => {
    return data?.filter((record) =>
      keys.some((key) =>
        record[key]?.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
      )
    );
  };

  const drawer = <DrawerContent />;

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <CssBaseline />
      <AppBar
        className="bg-sky-500"
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="text-slate-50"
            sx={{ flexGrow: 1 }}
          >
            Inventory Management
          </Typography>
          <Button
            onClick={handleDeleteItemCategory}
            className="text-slate-50 hover:text-slate-700 "
            sx={{display: { xs: 'none', sm: 'block' }}}
          >
            Delete Item Category
          </Button>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: 'none', sm: 'block' },
              height: 28,
              mx: 2,
              bgcolor: 'white',
              my: 'auto'
            }}
          />
          <Button
            onClick={handleAddItemCategory}
            className="text-slate-50 hover:text-slate-700 "
            sx={{display: { xs: 'none', sm: 'block' }}}
          >
            Add Item Category
          </Button>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: 'none', sm: 'block' },
              height: 28,
              mx: 2,
              bgcolor: 'white',
              my: 'auto'
            }}
          />
           <Button onClick={handleSignOut} className='text-slate-50 hover:text-red-700' >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="drawer"
      >
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
              keepMounted: true,
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
        className="bg-slate-100 overflow-y-auto h-dvh"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4 px-4">
          <div  className="flex items-baseline gap-4 flex-wrap">
            <h4 className="lg:text-3xl text-xl font-semibold database-title ">INVENTORY: </h4>
            <form className="flex items-center bg-slate-300 p-1 rounded-md md:w-80">
              <SearchIcon className="text-gray-600 ml-2 mr-1" />
              <input
                type="text"
                placeholder="Search"
                className="bg-slate-300 placeholder-gray-600 outline-none w-full p-1"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '1rem' }}>
            <button
              onClick={handleAddInventory}
              className="open-add-form-btn mt-3"
            >
              ADD ITEM
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <CircularProgress />
          </div>
        ) : (
          <div>
            <InventoryTable data={handleSearchQuery(data)} />
          </div>
        )}
      </Box>
    </Box>
  );
}
