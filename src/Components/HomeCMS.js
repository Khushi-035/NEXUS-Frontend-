import React from 'react'
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';


// import { folium_data } from './Data/folium_data'

import L from "leaflet";
import "../App.css";
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-draw/dist/leaflet.draw.css';
import { MapContainer, TileLayer, Marker, FeatureGroup, Circle, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import MarkerClusterGroup from "react-leaflet-cluster";
import { setEmpName } from './Features/EmpDetails/EmpSlice';


import { Icon, divIcon } from "leaflet";


import logo from './Images/logo.png';


// Routing
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


function customIconF(condition) {
  // console.log(marker);

  if (condition === "Stable") {
    return customIcon2;
  }

  if (condition === "Dangerous") {
    return customIcon3;
  }
  if (condition === "Critical") {
    return customIcon4;
  }
  else
    return customIcon;
}

// create custom icon
const customIcon = new Icon({
  iconUrl: require("./Images/all.png"),
  iconSize: [38, 38]
});
const customIcon2 = new Icon({
  iconUrl: require("./Images/stable.png"),
  iconSize: [38, 38]
});
const customIcon3 = new Icon({
  iconUrl: require("./Images/unstable.png"),
  iconSize: [38, 38]
});
const customIcon4 = new Icon({
  iconUrl: require("./Images/critical.png"),
  iconSize: [38, 38]
});


// [29.4289, 76.9309]; // latitute, longitude
const initialPosition = [28.5589,77.2079]; // latitute, longitude
const circleRadius = 8000; // in meters
// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span className="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: L.point(50, 50, true)
  });
};

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});


export default function HomeCMS(props) {

  const { count, data2 } = props;
  // const [outsideMarkers, setOutsideMarkers] = useState(new Set());   // for yellow warning


  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of the Earth in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in meters
    return distance;
  }

  // console.log('outside',outsideMarkers);
  
  useEffect(() => {
    if (!data2 || !Array.isArray(data2)) {
      return; // Exit early if data2 is undefined or not an array
    }

    const newOutsideMarkers = new Set(); // Temporary set to track new markers outside the circle

    data2.forEach(marker => {
      if (marker.location && marker.location.latitude !== undefined && marker.location.longitude !== undefined) {
        const distance = getDistanceFromLatLonInMeters(
          marker.location.latitude.toFixed(4), 
          marker.location.longitude.toFixed(4), 
          initialPosition[0], 
          initialPosition[1]
        );

        if (distance > circleRadius) {
          newOutsideMarkers.add(marker.deviceId);
        }
      }
    });


    // Update the state with the current set of outside markers
    // setOutsideMarkers(newOutsideMarkers);
  }, [data2]);

  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCount(prevCount => {
        if (prevCount < count) {
          return prevCount + 1;
        } else {
          clearInterval(interval); // Stop the interval when the count is reached
          return prevCount;
        }
      });
    }, 50);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [count]);



  const unactiveCount = data2?.filter(d => d.status === false).length;
  const [unactive, setUnactive] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setUnactive(prevCount => {
        if (prevCount < unactiveCount) {
          return prevCount + 1;
        } else {
          clearInterval(interval); // Stop the interval when the count is reached
          return prevCount;
        }
      });
    }, 50);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [unactiveCount]);

  const activeCount = data2?.filter(d => d.status === true).length;
  const [active, setActive] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prevCount => {
        if (prevCount < activeCount) {
          return prevCount + 1;
        } else {
          clearInterval(interval); // Stop the interval when the count is reached
          return prevCount;
        }
      });
    }, 50);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [activeCount]);
  
  const injured = data2?.filter(d => d.fallDamage === true).length;
  const [injury, setInjury] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setInjury(prevCount => {
        if (prevCount < injured) {
          return prevCount + 1;
        } else {
          clearInterval(interval); // Stop the interval when the count is reached
          return prevCount;
        }
      });
    }, 50);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [injured]);



  // const map = useMap();

  // const [position, setPosition] = useState([null, null]);

  // const healthCondFunc = (emp_name) => {
  //   const emp = data ? data.find(d => d.name === emp_name) : '';
  //   return emp.condition;
  // }

  const healthCondFunc = (name) => {
    let status = data2 ? data2.find(d => d.uid === name) : '';
    // console.log('status',status);
    let hr = status?.heartRate;
    let spo2 = status?.spo2;
    let temp = status?.bodyTemperature;
    let rr = status?.respiratoryRate;
    let hr_score = 0;
    let temp_score = 0;
    let spo2_score = 0;
    let rr_score = 0;
    if (hr >= 51 && hr <= 90)
      hr_score = 3
    else if ((hr >= 40 && hr <= 50) || (hr >= 91 && hr <= 110))
      hr_score = 2
    else if (hr < 40 || hr >= 110)
      hr_score = 1

    if (spo2 >= 96 && spo2 <= 100)
      spo2_score = 2
    else if (spo2 >= 91 && spo2 <= 95)
      spo2_score = 1
    else if (spo2 < 91)
      spo2_score = 0

    if (temp >= 36.1 && temp <= 38.0)
      temp_score = 1
    else if (temp < 36.1 || temp > 38.0)
      temp_score = 0

    if (rr >= 8 && rr <= 16)
      rr_score = 2
    else if (rr < 8 && rr > 16)
      rr_score = 1
    else
      rr_score = 0


    let Modified_NEWS = (rr_score * 0.2) + (spo2_score * 0.2) + (temp_score * 0.15) + (hr_score * 0.3)
    // (AVPU score * AVPU weight) 

    let TOTAL_HEALTH_SCORE = (Modified_NEWS / 2.15) * 100

    // console.log('THS',TOTAL_HEALTH_SCORE);
    // if (parseInt(TOTAL_HEALTH_SCORE) > 80 && parseInt(TOTAL_HEALTH_SCORE) <= 100) {
    //   return 'Stable'
    // } else if (parseInt(TOTAL_HEALTH_SCORE) > 60 && parseInt(TOTAL_HEALTH_SCORE) <= 80) {
    //   return 'Unstable'
    // } else if (parseInt(TOTAL_HEALTH_SCORE) > 40 && parseInt(TOTAL_HEALTH_SCORE) <= 60) {
    //   return 'Dangerous'
    // } else {
    //   return 'Critical'
    // }



    const healthScore = parseInt(TOTAL_HEALTH_SCORE);

    if (healthScore > 70 && healthScore <= 100) {
      return 'Stable';
    } else if (healthScore > 40 && healthScore <= 70) {
      return 'Dangerous';
    } else {
      return 'Critical';
    }

  }


  const [Cond, setCond] = useState("All");
  

  const changeCond = () => {
    setCond("All");
    setStatus(true);
  }
  const changeCondS = () => {
    setCond("Stable");
    setStatus(false);
  }
  // const changeCondU = () => {
  //   setCond("Unstable");
  //   if (status) {
  //     setStatus(false);
  //   }
  // }
  const changeCondD = () => {
    setCond("Dangerous");
    if (status) {
      setStatus(false);
    }
  }
  const changeCondC = () => {
    setCond("Critical");
    if (status) {
      setStatus(false);
    }
  }

  const [status, setStatus] = useState(true);

  // const _onCreate = (e) => console.log(e);
  const dispatch = useDispatch();



  const navigate = useNavigate();
  // const redirectTo = (e) => {
  //   dispatch(setEmpName({
  //     emp: e.target.textContent
  //   }));
  //   navigate('/EmployeeDetails');
  // }



  const redirectTo = (uid) => {
    dispatch(setEmpName({ emp: uid }));
    navigate('/EmployeeDetails');
  }



  return (
    <Box sx={{ px: { xl: 3, lg: 3, md: 0, sm: 0 }, mt: 2 }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h4' sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>Casualty Management Platform</Typography>
        <img src={logo} alt='cms' width='100px' />
      </Box>


      <Box sx={{ display: 'grid', gridTemplateColumns: { xl: 'repeat(5, 1fr)', lg: 'repeat(5, 1fr)', md: '1fr 1fr 1.5fr 0.5fr 1fr', sm: '1fr 1fr 1.5fr 0.5fr 1fr' }, maxWidth: { xl: '90%', lg: '90%', md: '100%', sm: '100%' }, gap: '30px', my: 3 }}>
        <Box>
          <Typography align='center'>All Devices</Typography>
          <Typography variant='h4' align='center'>
            {currentCount}
          </Typography>
        </Box>
        <Box>
          <Typography align='center'>Active Devices</Typography>
          <Typography variant='h4' align='center'>{active}</Typography>

        </Box>
        <Box>
          <Typography align='center'>Not Active Devices</Typography>
          <Typography variant='h4' align='center'>{unactive}</Typography>
        </Box>
        <Box>
          <Typography align='center'>Injuries</Typography>
          <Typography variant='h4' align='center'>{injury}</Typography>
        </Box>
        <Box>
          <Typography align='center'>Altitude</Typography>
          <Typography variant='h4' align='center'>222m</Typography>
        </Box>
      </Box>


      <Typography variant='h4' sx={{ fontFamily: 'Poppins', fontWeight: 600, mt: 4 }}>Health Condition</Typography>


      <Box className='army-cms-maps'>

        <Box className="radio-groups" sx={{ my: 3, display: 'flex', gap: '50px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input type="radio" id="All" name="last option" className="All" value="All" onChange={changeCond} checked={status} />
            <label htmlFor="All">All</label>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input type="radio" id="Stable" name="last option" className="Stable" value="Stable" onChange={changeCondS} />
            <label htmlFor="Stable">Stable</label>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input type="radio" id="Dangerous" name="last option" className="Dangerous" value="Dangerous" color='primary' onChange={changeCondD} />
            <label htmlFor="Dangerous">Dangerous</label>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input type="radio" id="Critical" name="last option" className="Critical" value="Critical" onChange={changeCondC} />
            <label htmlFor="Critical">Critical</label>
          </Box>
        </Box>


        <Box sx={{ display: 'flex', alignItems: 'start' }}>
          <MapContainer center={initialPosition} zoom={18} minZoom={16} maxZoom={18}>
            <FeatureGroup>
              <EditControl
                position='topleft'
                // onCreated={_onCreate}
                draw={{}}
              />
            </FeatureGroup>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Circle center={initialPosition} pathOptions={{ color: '#f5945c' }} radius={circleRadius} />

            <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
              {data2 ? data2.filter((d) => {
                if (d.uid !== '') {
                  if (healthCondFunc(d.uid) === Cond) {
                    return d;
                  }
                }
                if (Cond === "All" && d.uid !== '') {
                  return d;
                }
                return null;
              }).map((marker, i) => (
                <Marker key={i} position={[marker.location.latitude, marker.location.longitude]} icon={customIconF(healthCondFunc(marker.uid))} >
                  <Popup>
                    <Typography align='center' style={{marginBottom: 0}}>{marker.uid}</Typography>
                    <Typography align='center' style={{marginBottom: '2px', marginTop: 0}}>{marker.status? 'Connected': 'Disconnected'}</Typography>
                    <button className='btns-edit' style={{marginTop: '2px'}} onClick={() => redirectTo(marker.uid) }>Details</button>
                  </Popup>
                </Marker>
              )) : ''}
            </MarkerClusterGroup>
          </MapContainer>

          <Paper sx={{ bgcolor: '#e8f2fc', width: { xl: '25%', lg: '25%', md: '30%', sm: '30%' }, margin: '0 auto', p: 3 }} elevation={5}>
            <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>Legend</Typography>
            <Typography sx={{ bgcolor: '#e8f2fc', p: 1 }}>🟢 Green: Stable Condition</Typography>
            {/* <Typography sx={{ bgcolor: '#e8f2fc', p: 1 }}>🔵 Blue: Unstable Condition</Typography> */}
            <Typography sx={{ bgcolor: '#e8f2fc', p: 1 }}>🟡 Yellow: Dangerous Condition</Typography>
            <Typography sx={{ bgcolor: '#e8f2fc', p: 1 }}>🔴 Red: Critical Condition</Typography>
          </Paper>
        </Box>

      </Box>


    </Box>
  )
}


//  🟢Green: Normal Vitals
//  🟡Yellow: Slight Irregularity in Vitals
//  🔴Red: High Irregularity in Vitals




