import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useMediaQuery, useTheme } from '@mui/material';

// MUI Components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button, Paper, Container } from '@mui/material';

// Firebase
import { auth, db } from '../config/firebase-config';
import { signOut } from 'firebase/auth';
// import { collection, getDocs } from 'firebase/firestore'; // Uncomment when ready

// Components
import DrawerContent from '../components/MaterialUI/SidebarModule';

const drawerWidth = 280;

// Dummy Data - Replace with Firebase data
const branchData = [
  { name: 'Main Clinic', value: 624 },
  { name: 'North Branch', value: 312 },
  { name: 'South Branch', value: 268 },
  { name: 'East Branch', value: 195 },
];

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);


  /* Firebase Integration Ready
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchesSnapshot = await getDocs(collection(db, 'branches'));
        const statsSnapshot = await getDocs(collection(db, 'stats'));
        
        // Process data here
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  */
 // Calculate total patients and percentages
 const totalPatients = branchData.reduce((sum, branch) => sum + branch.value, 0);
 const branchPercentages = branchData
   .map(branch => ({
     ...branch,
     percentage: ((branch.value / totalPatients) * 100).toFixed(1)
   }))
   .sort((a, b) => b.value - a.value);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("Sign out successful");
    }).catch((error) => {
      console.error(error);
    });
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
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
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
          <Typography variant="h6" className='text-slate-50' noWrap sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button onClick={handleSignOut} className='text-slate-50 hover:text-red-700'>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          onTransitionEnd={handleDrawerTransitionEnd}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          slotProps={{ root: { keepMounted: true } }}
        >
          <DrawerContent />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <DrawerContent />
        </Drawer>
      </Box>

      <Box
        component="main"
        className="bg-slate-100 overflow-y-auto min-h-screen"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container>
          {/* Announcements */}
          <div className="flex flex-wrap gap-4 mb-6 px-4">
            <Paper className="p-4 shadow rounded-xl w-full">
              <Typography variant="subtitle1">📢 Announcements</Typography>
              <Typography variant="body2" className="text-gray-500">
                New clinic hours start May 1st
              </Typography>
            </Paper>
          </div>
          
          {/* Pie Chart Section */}
          <div className="flex flex-wrap gap-4 mb-6 px-4">
            <Paper className="p-4 shadow rounded-xl w-full" style={{ minHeight: isMobile ? 'auto' : 400 }}>
              <Typography variant="h6" className="mb-4">
                📊 Patient Distribution by Branch
              </Typography>
              
              {isMobile ? (
                // Mobile Text View
                <div className="space-y-3">
                  {branchPercentages.map((branch, index) => (
                    <div key={branch.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <Typography variant="body2">{branch.name}</Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <Typography variant="body2" className="font-medium">
                          {branch.value}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                          ({branch.percentage}%)
                        </Typography>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 text-sm text-gray-500">
                    Total patients: {totalPatients.toLocaleString()}
                  </div>
                </div>
              ) : (
                // Desktop Pie Chart
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={branchData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {branchData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} patients`, 'Count']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend 
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{
                        paddingLeft: '20px',
                        backgroundColor: 'transparent'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-wrap gap-4 mb-6 px-4">
            <Paper className={`p-4 shadow rounded-xl ${isMobile ? 'w-full' : 'min-w-[250px] flex-1 max-w-sm'}`}>
              <Typography variant="subtitle1">👨‍⚕️ Employees</Typography>
              <Typography variant="h5">23</Typography>
              <Typography variant="body2" className="text-green-500">
                +2 this month
              </Typography>
            </Paper>
            <Paper className={`p-4 shadow rounded-xl ${isMobile ? 'w-full' : 'min-w-[250px] flex-1 max-w-sm'}`}>
              <Typography variant="subtitle1">📦 Inventory</Typography>
              <Typography variant="h5">452 Items</Typography>
              <Typography variant="body2" className="text-green-500">
                +15 restocked
              </Typography>
            </Paper>
            <Paper className={`p-4 shadow rounded-xl ${isMobile ? 'w-full' : 'min-w-[250px] flex-1 max-w-sm'}`}>
              <Typography variant="subtitle1">🧑‍🤝‍🧑 Patients</Typography>
              <Typography variant="h5">1,204</Typography>
              <Typography variant="body2" className="text-blue-500">
                ↑ 3% from last month
              </Typography>
            </Paper>
          </div>



          {/* Additional Stats */}
          <div className="flex flex-wrap gap-4 px-4">
            <Paper className={`p-4 shadow rounded-xl ${isMobile ? 'w-full' : 'min-w-[250px] flex-1 max-w-sm'}`}>
              <Typography variant="subtitle1">🏆 Top Patient Visitor</Typography>
              <Typography variant="body2" className="text-gray-600">
                Juan Dela Cruz - 9 visits
              </Typography>
            </Paper>
            <Paper className={`p-4 shadow rounded-xl ${isMobile ? 'w-full' : 'min-w-[250px] flex-1 max-w-sm'}`}>
              <Typography variant="subtitle1">💉 Most Used Treatment</Typography>
              <Typography variant="body2" className="text-gray-600">
                Vitamin B12 Injection - 45 times
              </Typography>
            </Paper>
            {!isMobile && (
              <Paper className="p-4 shadow rounded-xl min-w-[250px] flex-1 max-w-sm">
                <Typography variant="subtitle1">🏥 Branch with Most Patients</Typography>
                <Typography variant="body2" className="text-gray-600">
                  Main Clinic - 624 patients
                </Typography>
              </Paper>
            )}
          </div>
        </Container>
      </Box>
    </Box>
  );
}