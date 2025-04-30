//For MUI
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';


//From React
import { useState, useEffect } from "react";
import "../../pages/PatientFiles/database.css";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { ref, onValue } from "firebase/database";
import { Button } from '@mui/material';
import PatientTable from './PatientTable';
import { auth } from '../../config/firebase-config';
import { signOut } from 'firebase/auth';
import DrawerContent from '../../components/MaterialUI/SidebarModule';

//controls the width of the sidebar drawer
const drawerWidth = 280;

export default function PatientPage() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [data, setData] = useState([]);
  const [dataRecords, setRecordData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // Add this near your state declarations
  const [isLoading, setIsLoading] = useState(true);

  //Imports Sidebar
  const drawer = <DrawerContent  />;
  const Nav = useNavigate();

  //Filter Keys for Search Function
  const keys = ["firstName", "lastName"];

  //Retrive and Read Tree from Realtime Database Once
  useEffect(() => {
    const itemsRef = ref(database, "patients/");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedItems = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];

      //export loaded items from local func to main Func
      setData(loadedItems);
      setIsLoading(false); // ✅ Stop loading once data is retrieved
    });
  }, []);

  //Called and Cached in case of deletion of patient
  useEffect(() => {
    const itemsRef = ref(database, "TreatmentRecords/");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedItems = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];

      //export loaded items from local func to main Func
      setRecordData(loadedItems);
    });
  }, []);

  const handleSearchQuery = (data) => {
    return data?.filter((patient) =>
      keys.some((key) =>
        patient[key]
          ?.toString()
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase())
      )
    );
  };


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
      className='bg-sky-500'
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
          
          <Typography variant="h6" className='text-slate-50' noWrap component="div" sx={{ flexGrow:1, }}>
            Patient Management
          </Typography>
          <Button onClick={handleSignOut} className='text-slate-50 hover:text-red-700' >Log Out</Button>
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
      {/*Main Content Start===============================================================*/}
      <Box
        component="main"
        className='bg-slate-100 overflow-y-auto h-dvh'
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }}}
      >
        <Toolbar />
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4 px-4 ">
            <div className="flex items-baseline gap-4 flex-wrap">
              <h4 className="lg:text-3xl text-xl font-semibold database-title">
                PATIENT DIRECTORY:
              </h4>
              <form className="flex items-center bg-slate-300 p-1 rounded-md md:w-80">
                <SearchIcon className="text-gray-600 ml-2 mr-1" />
                <input
                  type="text"
                  placeholder="Search By Name"
                  className="bg-slate-300 placeholder-gray-600 outline-none w-full p-1"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            <div className="flex flex-nowrap gap-4">
              <button
                onClick={() => Nav("/patient/add")}
                className="open-add-form-btn mt-3"
              >
                ADD NEW PATIENT
              </button>
            </div>
          </div>
          {/*Sends data from firebase and setSearchQuery to Table*/}
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <CircularProgress />
            </div>
          ) : (
            <PatientTable data={handleSearchQuery(data)} dataRecords={dataRecords} />
          )}
        
      </Box>
      {/*Main Content End=================================================================*/}
    </Box>
  );
}


