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
import CryptoJS from 'crypto-js';
import DrawerContent from '../../components/MaterialUI/SidebarModule';
import InventoryTransactionsTable from './InventoryTransactionsTable';


const SECRET_KEY = process.env.REACT_APP_AES_ENCRYPTION_KEY;
const drawerWidth = 280;

export default function InventoryTransactionsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryItemData, setInventoryItemData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {
     if ("caches" in window) {
       caches.open("InventoryItemData").then((cache) => {
         cache.match("InventoryItemData").then((response) => {
           if (response) {
             response.text().then(async (encryptedText) => {
               try {
                 const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
                 const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                 if (!decryptedData) {
                   console.error("❌ Failed to decrypt InventoryItemData.");
                   return;
                 }
                 const parsedData = JSON.parse(decryptedData);
                 setInventoryItemData(parsedData);
 
               } catch (err) {
                 console.error("⚠️ Cache or Firebase fetch error:", err);
               }
             });
           }
         });
       });
     }
   }, []);

  useEffect(() => {
    const itemsRef = ref(database, '/InventoryTransactions');
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

  const handleCloseRecord = useCallback((e) => {
    e.preventDefault();
    navigate('/inventory');
  }, [navigate]);

    const handleSignOut =() => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Sign out successful")
          }).catch((error) => {
            // An error happened.
          });;
    };

  const cacheData = useCallback((key, data) => {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    if ("caches" in window) {
      caches.open(key).then((cache) => {
        cache.put(key, new Response(encrypted));
        console.log("Encrypted & Cached:", encrypted);
      });
    }
  }, []);

  const handleAddTransaction = useCallback((e, item) => {
    e.preventDefault();
    cacheData("addInventoryTransaction", item);
    navigate('/inventory/transactions/add');
  }, [navigate, cacheData]);

  const keys = ['transactionDate'];
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
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Treatment Records
          </Typography>
          <Button
            onClick={handleCloseRecord}
            className="text-slate-50 hover:text-slate-700"
            
          >
            ⬅ Back to Inventory
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
           <Button onClick={handleSignOut} className='text-slate-50 hover:text-red-700' sx={{ display: { xs: 'none', sm: 'block' }}} >Log Out</Button>
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
            <h4 className="lg:text-3xl text-xl font-semibold database-title ">TREATMENT RECORDS: </h4>
            <form className="flex items-center bg-slate-300 p-1 rounded-md md:w-80">
              <SearchIcon className="text-gray-600 ml-2 mr-1" />
              <input
                type="text"
                placeholder="Search by Date"
                className="bg-slate-300 placeholder-gray-600 outline-none w-full p-1"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <button
            onClick={(e) => handleAddTransaction(e, inventoryItemData)}
            className="open-add-form-btn mt-3"
          >
            ADD NEW TRANSACTION
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <CircularProgress />
          </div>
        ) : (
         // <TreatmentTable data={handleSearchQuery(data)} />
        <div>

          <InventoryTransactionsTable data={handleSearchQuery(data)}itemData={inventoryItemData}/>
        </div> 
          
        )}
      </Box>
    </Box>
  );
}
