import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import LogoutIcon from '@mui/icons-material/Logout';
import { Button, Typography } from '@mui/material';
import NotFound from './NotFound';
import UniversalLog from './UniversalLog';
import JawaanAdd from './AddNewJawaan';
import DeviceAdd from './AddNewDevice';
import AddNewMedic from './AddNewMedic';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser } from './Features/UserAuth/UserSlice';
import { setEmpName, rmEmpName } from './Features/EmpDetails/EmpSlice';
import HomeCMS from './HomeCMS';
import EvacuationDetails from './EvacuationDetails';
import EmployeeDetails from './EmployeeDetails';
import Records from './Records';
import Userlog from './Userlog';
import AlertModal from './AlertModal';
import DeviceConn from './DeviceConn';

import { Routes, Route, Navigate, Link, useNavigate
} from "react-router-dom";
import { useLocation } from 'react-router-dom';

import logo from './Images/logo.png';

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Nav() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();


  // State for controlling the open/close state of the drawer
  const [open, setOpen] = useState(true);

  // State for storing employee data
  const [empData, setEmpData] = useState(null);

  // State for storing device data
  const [devData, setDevData] = useState(null);

  // State for storing graph data
  const [grData, setGrData] = useState(null);

  // State for controlling the open/close state of the "Add Jawaan" modal
  const [openAddJawaanModal, setAddJawaanModal] = useState(false);

  // State for controlling the open/close state of the "Add Device" modal
  const [openAddDeviceModal, setAddDeviceModal] = useState(false);

  // State for controlling the open/close state of the "Add Medic" modal
  const [openAddMedicModal, setAddMedicModal] = useState(false);

  // Function to handle opening the "Add Jawaan" modal
  const handleOpenAddJawaanModal = () => {
    setAddJawaanModal(true);
  };

  // Function to handle closing the "Add Jawaan" modal
  const handleCloseAddJawaanModal = () => {
    setAddJawaanModal(false);
  };

  // Function to handle opening the "Add Device" modal
  const handleOpenAddDeviceModal = () => {
    setAddDeviceModal(true);
  };

  // Function to handle closing the "Add Device" modal
  const handleCloseAddDeviceModal = () => {
    setAddDeviceModal(false);
  };

  // Function to handle opening the "Add Medic" modal
  const handleOpenAddMedicModal = () => {
    setAddMedicModal(true);
  };

  // Function to handle closing the "Add Medic" modal
  const handleCloseAddMedicModal = () => {
    setAddMedicModal(false);
  };

  // Function to handle opening the drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // Function to handle closing the drawer
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Function to handle logging out
  const handleLogout = () => {
    dispatch(logout());
    dispatch(rmEmpName());
    navigate('/login');
  };

  // Fetch employee details from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://cms-backend-five.vercel.app/api/details/jawaanDetails', {
          username: user?.username
        }, {
          headers: {
            'Authorization': `Bearer ${user?.accessToken}`
          }
        });
        setEmpData(response.data.jawaanDetails);
        
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Fetch data every 3 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [user?.accessToken, user?.username]);
  
  const [count, setCount] = useState(0);
  const [prevStatus, setPrevStatus] = useState({});
  const [connMsg, setConnMsg] = useState('');
  // Fetch device details from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://cms-backend-five.vercel.app/api/details/deviceDetails', {
          username: user?.username
        }, {
          headers: {
            'Authorization': `Bearer ${user?.accessToken}`
          }
        });
        setDevData(response.data.devices);
        setCount(response.data.devices.length);


        const newData = response.data.devices;
        setDevData(newData);
        setCount(newData.length);

        // Compare the previous and current statuses
        newData.forEach((device) => {
          const prevDeviceStatus = prevStatus[device.deviceId];

          // If the status has changed
          if (prevDeviceStatus !== undefined && prevDeviceStatus !== device.status) {
            console.log(`${device.deviceId}: ${device.status ? 'Connected' : 'Disconnected'}`);
            setConnMsg(`${device.deviceId}: ${device.status ? 'Connected' : 'Disconnected'}`);

            setTimeout(() => {
              setConnMsg('');
            }, 1000);
          }
        });

        // Update the previous statuses with the current ones
        const updatedStatus = {};
        newData.forEach((device) => {
          updatedStatus[device.deviceId] = device.status;
        });
        setPrevStatus(updatedStatus);


        // console.log(response.data.devices.length);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Fetch data every 3 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [user?.accessToken, user?.username, prevStatus]);

  // Fetch all data related to graph and vitals
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://cms-backend-five.vercel.app/api/details/historical', {
          username: user?.username
        }, {
          headers: {
            'Authorization': `Bearer ${user?.accessToken}`
          }
        });
        setGrData(response.data.hist);
        
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Fetch data every 3 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [user?.accessToken, user?.username]);


  const [allData, setAllData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://cms-backend-five.vercel.app/api/log/readLogs', {
          username: user?.username
        }, {
          headers: {
            'Authorization': `Bearer ${user?.accessToken}`
          }
        });
        setAllData(response.data.allLogs);
        response.data.allLogs.map((item) => {
          const currentDate = new Date();
          const apiDate = new Date(item.createdAt);

          if(item.message === "Device disconnected" && apiDate === currentDate){
            console.log('item:', item);
          } else if(item.message === "Device connected" && apiDate === currentDate){
            console.log('item:', item);
          }
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Fetch data every 3 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [user?.accessToken, user?.username]);



  // Function to navigate to EmployeeDetails page with the selected employee ID
  const navigateToEmployeeDetails = (id) => {
    const loc = devData ? devData.find(d => d.deviceId === id) : '';
    dispatch(setEmpName({
      emp: loc.uid
    }));
    navigate('/EmployeeDetails');
  };


  //--------------------


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{ mr: 2, ...(open && { display: 'none' }), position: 'absolute', left: 0, top: 0, border: '1px solid black', borderRadius: '0% 20% 20% 0%', px: 2, bgcolor: '#f0f2f6' }}
      >
        <ChevronRightIcon />
      </IconButton>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f0f2f6'
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{ bgcolor: '#f0f2f6 ' }}>
          <Box sx={{ position: 'relative', left: '-35%', my: 2, bgcolor: '#f0f2f6 ' }}>
          <img src={logo} alt="logo" width="135px" />
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <List sx={{ bgcolor: '#f0f2f6', p: 0 }}>
          <ListItem component={Link} to="/" sx={location.pathname === '/' ? { p: 0, bgcolor: '#e0e0e0' } : { p: 0 }}>
            <ListItemButton sx={{ px: 2 }}>
              <ListItemText primary='Home - CMS' sx={{ color: 'black', p: 0 }} />
            </ListItemButton>
          </ListItem>
        </List>

        <List sx={{ bgcolor: '#f0f2f6', p: 0 }}>
          <ListItem component={Link} to="/EmployeeDetails" sx={location.pathname === '/EmployeeDetails' ? { p: 0, bgcolor: '#e0e0e0' } : { p: 0 }}>
            <ListItemButton sx={{ px: 2 }}>
              <ListItemText primary='Employee Details' sx={{ color: 'black', p: 0 }} />
            </ListItemButton>
          </ListItem>
        </List>

        {/* <List sx={{ bgcolor: '#f0f2f6', p: 0 }}>
          <ListItem component={Link} to="/InjuryReport" sx={location.pathname === '/InjuryReport' ? { p: 0, bgcolor: '#e0e0e0' } : { p: 0 }}>
            <ListItemButton sx={{ px: 2 }}>
              <ListItemText primary='Injury Report' sx={{ color: 'black', p: 0 }} />
            </ListItemButton>
          </ListItem>
        </List> */}

        <List sx={{ bgcolor: '#f0f2f6', p: 0 }}>
          <ListItem component={Link} to="/EvacuationDetails" sx={location.pathname === '/EvacuationDetails' ? { p: 0, bgcolor: '#e0e0e0' } : { p: 0 }}>
            <ListItemButton sx={{ px: 2 }}>
              <ListItemText primary='Evacuation Details' sx={{ color: 'black', p: 0 }} />
            </ListItemButton>
          </ListItem>
        </List>


        <List sx={{ bgcolor: '#f0f2f6', p: 0 }}>
          <ListItem component={Link} to="/Records" sx={location.pathname === '/Records' ? { p: 0, bgcolor: '#e0e0e0' } : { p: 0 }}>
            <ListItemButton sx={{ px: 2 }}>
              <ListItemText primary='Records' sx={{ color: 'black', p: 0 }} />
            </ListItemButton>
          </ListItem>
        </List>


        {/* <List sx={{ bgcolor: '#f0f2f6', p: 0 }}>
          <ListItem component={Link} to="/Userlog" sx={location.pathname === '/Records' ? { p: 0, bgcolor: '#e0e0e0' } : { p: 0 }}>
            <ListItemButton sx={{ px: 2 }}>
              <ListItemText primary='User Log' sx={{ color: 'black', p: 0 }} />
            </ListItemButton>
          </ListItem>
        </List> */}


        <List sx={{ bgcolor: '#f0f2f6', p: 0 }}>
          <ListItem component={Link} to="/Userlog"
            sx={location.pathname === '/Userlog' ? { p: 0, bgcolor: '#e0e0e0' } : { p: 0 }}>
            <ListItemButton sx={{ px: 2 }}>
              <ListItemText primary='User Log' sx={{ color: 'black', p: 0 }} />
            </ListItemButton>
          </ListItem>
        </List>


        {/* Conditional rendering of "Add Jawaan", "Add Device", and "Add Medic" buttons */}
        {user?.role === 'admin' && (
          <Box sx={{ bgcolor: '#f0f2f6', m: 2 }}>
            <Button variant="outlined" sx={{ mb: 2 }} onClick={handleOpenAddMedicModal}>
              Create Medic
            </Button>
            <Button variant="outlined" sx={{ mb: 2 }} onClick={handleOpenAddDeviceModal}>
              Add New Device
            </Button>
            <Button variant="outlined" onClick={handleOpenAddJawaanModal}>
              Add New Employee
            </Button>
          </Box>
        )}

        {/* Logout button */}
        <List sx={{ bgcolor: '#f0f2f6', px: 1, position: 'absolute', bottom: 0 }}>
          <ListItem component={Link} to="/login" onClick={handleLogout}>
            <LogoutIcon sx={{ fontSize: '30px' }} />
            <ListItemButton>
              <ListItemText primary={<Typography sx={{ fontWeight: 600 }} variant='h6'>Logout</Typography>} sx={{ color: 'black' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Modals */}
      <JawaanAdd open={openAddJawaanModal} onClose={handleCloseAddJawaanModal} data={devData} />
      <DeviceAdd open={openAddDeviceModal} onClose={handleCloseAddDeviceModal} />
      <AddNewMedic open={openAddMedicModal} onClose={handleCloseAddMedicModal} />

      {/* Main content */}
      <Main open={open}>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomeCMS count={count} data={empData} data2={devData} />} />
          {/* <Route path="/InjuryReport" element={<InjuryReport data={empData} data2={devData} />} /> */}
          <Route path="/EvacuationDetails" element={<EvacuationDetails />} />
          <Route path="/EmployeeDetails" element={<EmployeeDetails data={empData} data2={devData} data3={grData} />} />
          <Route path="/Records" element={<Records data={empData} data2={devData} data3={grData} />} />
          <Route path="/Userlog" element={<Userlog data2={devData} data={allData} />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>

        {/* UniversalLog component */}
        <UniversalLog data={devData} Empid={navigateToEmployeeDetails} />
        { empData && user?.role === 'admin' && <DeviceConn message={connMsg} /> }
        { empData && user?.role === 'admin' && <AlertModal /> }
      </Main>
    </Box>
  );
}
