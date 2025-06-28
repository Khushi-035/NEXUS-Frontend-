import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import { styled } from '@mui/material/styles';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));




function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;



  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Records(props) {

  // console.log(voc_data);
  
  const { data, data2, data3 } = props; // data -> JW || data2 -> dev || data3 -> Graph

  // Function to filter data from the last 24 hours
  // const getLast24HoursData = () => {
  //   const now = new Date();
  //   return data3.filter(item => {
  //     const updatedAt = new Date(item.updatedAt); // Ensure updatedAt is in correct Date format
  //     return now - updatedAt <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  //   });
  // };

  // const last24HoursData = getLast24HoursData(data3); // Get the last 24 hours data for the graph


  // ------------------------------download

  const generateCSV = (data) => {
    const header = ['UID', 'Name', 'Ambient Temperature (°C)', 'Ambient Pressure (hPa)', 'AQI', 'VOC', 'Humidity', 'Time Added At'];
    const rows = data.map(d => [
      d.uid,
      selectedDetails.name, // Assuming selectedDetails is accessible
      d.environment.ambientTemperature,
      d.environment.ambientPressure,
      d.environment.aqi,
      d.environment.voc,
      d.relativeHumidity,
      d.updatedAt.slice(11, 19) // Time only
    ]);
  
    // Combine header and rows into a single CSV string
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    return csvContent;
  };
  
  // Function to trigger CSV download
  const downloadCSV = (csvContent) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    const filteredData = data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '' && d.uid === selectedOption)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) : [];
  
    const csvContent = generateCSV(filteredData);
    downloadCSV(csvContent);
  };

  // end


  // ------------------------------search

  const [view, setView] = useState(false);    // for showing/hiding the options
  const toggleHandler = () => setView(!view);

  const [inpValue, setInpValue] = useState('');

  const [selectedOption, setSelectedOption] = useState('');
  const selectedDetails = data ? data.find(d => d.id === selectedOption) : '';

  const [healthCond, setHealthCond] = useState('');
  const [healthSc, setHealthSc] = useState(false);

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

    const healthScore = parseInt(TOTAL_HEALTH_SCORE);

    // Determine health condition based on health 

    if (healthScore > 70 && healthScore <= 100) {
      setHealthCond('Stable');
    } else if (healthScore > 40 && healthScore <= 70) {
      setHealthCond('Dangerous');
    } else {
      setHealthCond('Critical');
    }
  }
  

  // ------------------------------start(For charts)
  const [tempData, setTempData] = useState({
    labels: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.updatedAt) : '',
    datasets: [
        {
            label: "Temperature",
            height: '80vh',
            data: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.environment.ambientTemperature) : '',
            backgroundColor: [
              'rgb(255,99,132)'
            ],
        },
        
    ],
  });  // temp
  
  const [VOCData, setVOCData] = useState({
      labels: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.updatedAt) : '',
      datasets: [
          {
              label: "Volatile Organic Compound Variation Log",
              height: '80vh',
              data: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.environment.VOC) : '',
              backgroundColor: [
                '#e98b50'
              ]
          },
      ],
    });  // For VOC
  
  const [humiData, setHumiData] = useState({
      labels: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.updatedAt) : '',
      datasets: [
          {
              label: "Humidity",
              height: '80vh',
              data: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.relativeHumidity) : '',
              backgroundColor: [
                'rgb(255,205,86)'
              ]
          },
      ],
    });  // For humidity
  
  const [AQIData, setAQIData] = useState({
      labels: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.updatedAt) : '',
      datasets: [
          {
              label: "Air Quality Index",
              height: '80vh',
              data: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.environment.aqi) : '',
              backgroundColor: [
                'rgb(75,192,192)'
              ]
          },
      ],
    });  // For AQI
  
  const [APData, setAPData] = useState({
      labels: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.updatedAt) : '',
      datasets: [
          {
              label: "Ambient Pressure (in hPa)",
              height: '80vh',
              data: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.environment.ambientPressure) : '',
              backgroundColor: [
                'rgb(54,162,235)'
              ],
          },
      ],
    });  // For AP


    useEffect(() => {
        // Update chart data when data3 changes
        if (data3 && data3.length > 0) {
          const labels = data3.filter((d) => d.macId !== ":::::" && d.uid !== '' && d.uid === selectedOption).map((d) => d.updatedAt.slice(11, 19));
          const temperatureData = data3.filter((d) => d.macId !== ":::::" && d.uid !== '' && d.uid === selectedOption).map((d) => d.environment.ambientTemperature);
          const vocData = data3.filter((d) => d.macId !== ":::::" && d.uid !== '' && d.uid === selectedOption).map((d) => d.environment.voc);
          const humidityData = data3.filter((d) => d.macId !== ":::::" && d.uid !== '' && d.uid === selectedOption).map((d) => d.relativeHumidity);
          const aqiData = data3.filter((d) => d.macId !== ":::::" && d.uid !== '' && d.uid === selectedOption).map((d) => d.environment.aqi);
          const apData = data3.filter((d) => d.macId !== ":::::" && d.uid !== '' && d.uid === selectedOption).map((d) => d.environment.ambientPressure);
          
    
          setTempData({
            labels: labels,
            datasets: [
              {
                label: "Temperature",
                data: temperatureData,
                backgroundColor: ['rgb(255, 99, 132)'],
              },
            ],
          });
          setVOCData({
            labels: labels,
            datasets: [
              {
                label: "Volatile Organic Compound Variation Log",
                data: vocData,
                backgroundColor: ['#e98b50'],
              },
            ],
          });
          setHumiData({
            labels: labels,
            datasets: [
              {
                label: "Humidity",
                data: humidityData,
                backgroundColor: ['lightblue'],
              },
            ],
          });
          setAQIData({
            labels: labels,
            datasets: [
              {
                label: "Air Quality Index",
                data: aqiData,
                backgroundColor: ['gold'],
              },
            ],
          });
          setAPData({
            labels: labels,
            datasets: [
              {
                label: "Ambient Pressure",
                data: apData,
                backgroundColor: ['rgb(41,176,157)'],
              },
            ],
          });
        }
    }, [data3]);


    const optTemp = {
      scales: {
          x: {
              title: {
                  display: true,
                  text: 'Days'
              }
          },
          y: {
              title: {
                  display: true,
                  text: 'Avg Temp (in degree celsius)'
              }
          }
      },
  }
    const optVOC = {
      scales: {
          x: {
              title: {
                  display: true,
                  text: 'Days'
              }
          },
          y: {
              title: {
                  display: true,
                  text: 'VOC'
              }
          }
      }
  }
    const optHumi = {
      scales: {
          x: {
              title: {
                  display: true,
                  text: 'Days'
              }
          },
          y: {
              title: {
                  display: true,
                  text: 'Humidity'
              }
          }
      }
  }
    const optAQI = {
      scales: {
          x: {
              title: {
                  display: true,
                  text: 'Days'
              }
          },
          y: {
              title: {
                  display: true,
                  text: 'Air Quality Index'
              }
          }
      }
  }
    const optAP = {
      scales: {
          x: {
              title: {
                  display: true,
                  text: 'Days'
              }
          },
          y: {
              title: {
                  display: true,
                  text: 'Ambient Pressure (in hPa)'
              }
          }
      }
  }

// ------------------------------end

  const [value, setValue] = React.useState(0);

  const healthScoreFunc = (name) => {
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
    setHealthSc(parseInt(TOTAL_HEALTH_SCORE));
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };  // MUI event

  return (
  <Box sx={{px: 2}}>
    <DrawerHeader />
    <Typography variant='h4' sx={{fontFamily: 'Poppins', fontWeight: 600, mb: 2}}>Employee Records</Typography>
    <Box>
      

      <Box sx={{ p: 2, pb: 0, display: 'flex', mx: 2, mt: 3 }}>
        <Box className='search-box'>
          <Box className='search-tool' onClick={toggleHandler}>
            {selectedOption ? selectedOption : 'Search for Employee ID'}
            <ExpandMoreIcon />
          </Box>

          {view &&
            <ul className='name-lists'>
              <Box sx={{ position: 'sticky', top: 0 }}>
                <input type="text" name="" id="" placeholder='Search for Employee' className='inp-box inp-dr' value={inpValue} onChange={(e) => setInpValue(e.target.value)} />
              </Box>
              {data ? data.filter((emp) => {
                if (inpValue === '') {
                  return emp;
                }
                else if (emp.id.toLowerCase().includes(inpValue.toLowerCase())) {
                  return emp;
                }
              }).map((emp) => {
                return (
                  <li key={emp.id} onClick={() => { setSelectedOption(emp.id); toggleHandler(); healthScoreFunc(emp.id); healthCondFunc(emp.id); }}>
                    {emp.id}
                  </li>)
              }) : ''}
            </ul>
          }

        </Box>
      </Box>
    <Box className='records-grid'>
      <Box className='records-grid-child' sx={{ p: 3, display: { xl: 'block', lg: 'block', md: 'grid', sm: 'grid' }, gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
        {selectedDetails && (
          <>
            <Box>
              <h1>{selectedDetails.name}</h1>
            </Box>
            <Box sx={{ my: 3 }}>
              <h3>Health Score : </h3>
              <progress id="injury" className='jawaan-health-score' value={healthSc} max="100"></progress>
              <br />
              <label htmlFor="injury">{healthSc}%</label>
              <h3>Health: {healthCond}</h3>
            </Box>
            <Box sx={{ my: 3 }}>
              <input type='button' value='Download Past Records' className='btns' 
                onClick={handleDownload}
              />
            </Box>
          </>
        )}
        
        </Box>
        {selectedDetails && (
        <Box className='records-grid-child'>
          <div className="outer-wrapper">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th><b>ID</b></th>
                    <th><b>Name</b></th>
                    <th><b>Temp</b></th>
                    <th><b>Ambient Pressure</b></th>
                    <th><b>AQI</b></th>
                    <th><b>VOC</b></th>
                    <th><b>Humidity</b></th>
                    <th><b>Time</b></th>
                  </tr>
                </thead>
                <tbody>
                {data3 ? (
                  data3
                    .filter((d) => d.macId !== ":::::" && d.uid !== '' && d.uid === selectedOption)
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sort by updatedAt in descending order
                    .map((d) => (
                      <tr key={d.id}>
                        <td>{d.uid}</td>
                        <td>{selectedDetails.name}</td>
                        <td>{d.environment.ambientTemperature} °C</td>
                        <td>{d.environment.ambientPressure} hPa</td>
                        <td>{d.environment.aqi}</td>
                        <td>{d.environment.voc}</td>
                        <td>{d.relativeHumidity}</td>
                        <td>{d.updatedAt.slice(11, 19)}</td>
                      </tr>
                    ))
                ) : (
                  <tr><td colSpan="3" style={{textAlign: 'center'}}>Data loading...</td></tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </Box>
        )}
      </Box>
      <Box>
        {selectedDetails && (
          <Box sx={{ p: 3 }}>
            <Box className='records-grid-child'>
              <Container sx={{ width: '90%', marginTop: '20px' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
                  <Tab label="Temperature" {...a11yProps(0)} />
                  <Tab label="Ambient Pressure" {...a11yProps(1)} wrapped />
                  <Tab label="Air Quality Index" {...a11yProps(2)} wrapped />
                  <Tab label="Volatile Organic Compound" {...a11yProps(3)} wrapped />
                  <Tab label="Humidity" {...a11yProps(4)} wrapped />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <Typography variant='h6' sx={{mb: 2}}>Temperature Variation Log</Typography>
                    <Line className='graphs' data={tempData} options={optTemp} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <Typography variant='h6' sx={{mb: 2}}>Ambient Pressure Log</Typography>
                  <Line data={APData} options={optAP} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  <Typography variant='h6' sx={{mb: 2}}>Air Quality Index Log</Typography>
                  <Line data={AQIData} options={optAQI} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                  <Typography variant='h6' sx={{mb: 2}}>Volatile Organic Compound Log</Typography>
                  <Line data={VOCData} options={optVOC} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={4}>
                  <Typography variant='h6' sx={{mb: 2}}>Humidity</Typography>
                  <Line data={humiData} options={optHumi} />
                </CustomTabPanel>
              </Container>
            </Box>
          </Box>
        )}
      </Box>

      

    </Box>
  </Box>
  );
}
