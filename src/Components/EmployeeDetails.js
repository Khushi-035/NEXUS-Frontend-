import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { selectUser } from './Features/UserAuth/UserSlice';

import axios from 'axios';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import { useSelector, useDispatch } from 'react-redux';
import { rmEmpName, selectEmp } from './Features/EmpDetails/EmpSlice';

import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';


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

export default function JawaanDetails(props) {


  const empDet = useSelector(selectEmp);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [healthCond, setHealthCond] = useState('');


  // console.log('empDet', empDet);

  useEffect(() => {
    if (empDet?.emp) {
      healthScoreFunc(empDet?.emp);
      setSelectedOption(empDet?.emp);
      dispatch(rmEmpName());

      healthCondFunc(empDet?.emp);

    }
  }, [empDet?.emp]);



  const { data, data2, data3 } = props; // data -> JW || data2 -> dev || data3 -> Graph

  const [healthSc, setHealthSc] = useState(false);


  const [selectedOption, setSelectedOption] = useState('');
  const selectedDetails = data ? data.find(d => d.id === selectedOption) : '';
  const vitalsData = data2 ? data2.find(d => d.uid === selectedOption) : '';


  // console.log('selectedDetails', selectedDetails);
  // console.log('selectedOption', selectedOption);
  // console.log('vitalsData', vitalsData);

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

  // download data for each employee in CSV
  // function jsonToCsv(jsonData, excludedKeys = []) {
  //   const csvContent = [];
  //   const headers = Object.keys(jsonData).filter(key => !excludedKeys.includes(key));

  //   // Loop through each object property
  //   for (const property in jsonData) {
  //     if (excludedKeys.includes(property)) {
  //       continue; // Skip excluded keys
  //     }
  //     const value = jsonData[property];

  //     // Create a new row for each key-value pair
  //     const row = [property]; // Start with the key in the first column

  //     // Handle single or multi-valued fields
  //     if (Array.isArray(value)) {
  //       // Add each element of the array to subsequent columns
  //       value.forEach((item, index) => {
  //         if (index >= row.length) {
  //           row.push(''); // Add empty cells if needed for alignment
  //         }
  //         row[index + 1] = item; // Add value to next column
  //       });
  //     } else {
  //       // Add single value to the next column
  //       row.push(value);
  //     }

  //     // Add the completed row to CSV content
  //     csvContent.push(row.join(','));
  //   }

  //   return csvContent.join('\n');
  // }

  // function downloadCSV() {
  //   const excludedKeys = ["_id", "share_token", "__v"];
  //   const csvString = jsonToCsv(selectedDetails, excludedKeys);

  //   const csvBlob = new Blob([csvString], { type: 'text/csv' });
  //   const csvUrl = URL.createObjectURL(csvBlob);

  //   const link = document.createElement('a');
  //   link.href = csvUrl;
  //   link.download = 'past_records.csv'; // Customize filename if needed
  //   link.click();

  //   URL.revokeObjectURL(csvUrl); // Revoke object URL after download
  // }

    // ------------------------------download

    const generateCSV = (data) => {
      const header = ['UID', 'Name', 'Heart Rate', 'spo2', 'Respiratory Rate', 'Body Temperature', 'Altitude', 'Time Added At'];
      const rows = data.map(d => [
        d.uid,
        selectedDetails.name, // Assuming selectedDetails is accessible
        d.heartRate,
        d.spo2,
        d.respiratoryRate,
        d.bodyTemperature,
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
  


  // ------------------------------end

  // ------------------------------start(For charts)

  const [HRData, setHRData] = useState({
    labels: [],
    datasets: [
      {
        label: "Heart Rate (in beats per minute)",
        data: [],
        backgroundColor: [
          'rgb(54,162,235)'
        ]
      },
    ],
  });  // For hr

  const [HRVData, setHRVData] = useState({
    labels: [],
    datasets: [
      {
        label: "HRV (in ms)",
        data: [],
        backgroundColor: [
          'rgb(255,205,86)'
        ]
      },
    ],
  });  // For hrv

  const [Spo2Data, setSpo2Data] = useState({
    labels: [],
    datasets: [
      {
        label: "SP02 level (in %)",
        data: [],
        backgroundColor: [
          'rgb(75,192,192)'
        ]
      },
    ],
  });  // For AQI

  const [rrData, setrrData] = useState({
    labels: [],
    datasets: [
      {
        label: "Respiratory Rate (breaths per minute)",
        data: [],
        backgroundColor: [
          'rgb(255,205,86)'
        ],
      },
    ],
  });  // For AP

  const [tempData, setTempData] = useState({
    labels: [],
    datasets: [
      {
        label: "Avg Body temp (in degree celsius)",
        data: [],
        backgroundColor: [
          'rgb(255,99,132)'
        ],
      },

    ],
  });  // body-temp

  const [ALData, setALData] = useState({
    labels: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.updatedAt) : '',
    datasets: [
        {
            label: "Altitude (in hPa)",
            height: '80vh',
            data: data3 ? data3.filter((d) => d.macId !== ":::::" && d.uid !== '').map((d) => d.altitude) : '',
            backgroundColor: [
              'rgb(54,162,235)'
            ],
        },
    ],
  });  // For AP


  // dynamic graph data
  useEffect(() => {

    // Update chart data when data changes
    if (data3 && data3.length > 0) {
      const labels = data3.filter((d) => d.uid !== '' && d.uid === selectedOption).map((d) => d.updatedAt.slice(11, 19));
      // const labelforJawaan = data3.filter((d) => d.uid !== '').map((d) => d.updatedAt.slice(11, 19));

      // const jawaan = data3.find(d => d.uid === selectedOption);

      const hrData = data3.filter((d) => d.uid !== '').map((d) => d.heartRate);
      const hrvData = data3.filter((d) => d.uid !== '').map((d) => d.heartRateVariability);
      const rrData = data3.filter((d) => d.uid !== '').map((d) => d.respiratoryRate);
      const spo2Data = data3.filter((d) => d.uid !== '').map((d) => d.spo2);
      const tempData = data3.filter((d) => d.uid !== '').map((d) => d.bodyTemperature);
      const alData = data3.filter((d) => d.uid !== '').map((d) => d.altitude);


      // const datasets = data3.map((jawaan, index) => {
      //   const hrData = data3.map((d) => d.heartRate);
      //   return {
      //     label: jawaan.uid, // Dynamically set the label to jawaan name
      //     data: hrData,
      //     backgroundColor: ['rgb(255, 99, 132)'],
      //   };
      // });

      // setHRData({
      //   labels: labels,
      //   datasets: datasets,
      // });

      setHRData({
        labels: labels,
        datasets: [
          {
            label: "Heart Rate (in beats per minute)",
            data: hrData,
            backgroundColor: ['rgb(255, 99, 132)'],
          },
        ],
      });

      setHRVData({
        labels: labels,
        datasets: [
          {
            label: "HRV (in ms)",
            data: hrvData,
            backgroundColor: ['rgb(255,43,43)'],
          },
        ],
      });

      setrrData({
        labels: labels,
        datasets: [
          {
            label: "Respiratory Rate (breaths per minute)",
            data: rrData,
            backgroundColor: ['lightblue'],
          },
        ],
      });

      setSpo2Data({
        labels: labels,
        datasets: [
          {
            label: "SP02 level (in %)",
            data: spo2Data,
            backgroundColor: ['gold'],
          },
        ],
      });

      setTempData({
        labels: labels,
        datasets: [
          {
            label: "Avg Body temp (in degree celsius)",
            data: tempData,
            backgroundColor: ['rgb(41,176,157)'],
          },
        ],
      });

      setALData({
        labels: labels,
        datasets: [
          {
            label: "Altitude",
            data: alData,
            backgroundColor: ['rgb(41,176,157)'],
          },
        ],
      });
    }
  }, [data]);




  const optHR = {
    scales: {
      x: {
        inital: 0,
        title: {
          display: true,
          text: 'Time(in hrs)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Heart Rate (in beats per minute)'
        },
        // beginAtZero: true
      }
    }
  }
  const optHRV = {
    scales: {
      x: {
        // beginAtZero: true,
        title: {
          display: true,
          text: 'Time(in hrs)'
        }
      },
      y: {
        // beginAtZero: true,
        title: {
          display: true,
          text: 'HRV (in ms)'
        }
      }
    }
  }
  const optSpo2 = {
    scales: {
      x: {
        // beginAtZero: true,
        title: {
          display: true,
          text: 'Time(in hrs)'
        }
      },
      y: {
        // beginAtZero: true,
        title: {
          display: true,
          text: 'SP02 level (in %)'
        }
      }
    }
  }
  const optRR = {
    scales: {
      x: {
        // beginAtZero: true,
        title: {
          display: true,
          text: 'Time(in hrs)'
        }
      },
      y: {
        // beginAtZero: true,
        title: {
          display: true,
          text: 'Respiratory Rate (breaths per minute)'
        }
      }
    }
  }
  const optTemp = {
    scales: {
      x: {
        // beginAtZero: true,
        title: {
          display: true,
          text: 'Time(in hrs)'
        }
      },
      y: {
        // beginAtZero: true,
        title: {
          display: true,
          text: 'Avg Body temp (in degree celsius)'
        }
      }
    },
  }
  const optAL = {
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
                text: 'Altitudee (in m)'
            }
        }
    }
}

  // ------------------------------end



  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [view, setView] = useState(false);    // for showing/hiding the options
  const toggleHandler = () => setView(!view);

  const [inpValue, setInpValue] = useState('');

  const [medicInp, setMedicInp] = useState('');
  const [inp, setInp] = useState(false);
  const [type, setType] = useState('');

  const editMsg = (part, data) => {
    setType(part);
    if(inp===true && part === type){
      setInp(false);
    } else {
      setInp(true);
    }
    setMedicInp(data);
  }

  const sendMsg = () => {
    try {
      // console.log({id: selectedOption, [type]: [medicInp]});
      let body = "";
      if (!isNaN(parseInt(medicInp))) {
        body = parseInt(medicInp); // If it's a number, convert to number
      } else {
        body = medicInp.includes(',') ? medicInp.split(',').map(item => item.trim())  : [medicInp]; 
      }
      axios.put('https://cms-backend-five.vercel.app/api/details/updateJawaan', {
        id: selectedOption,
        [type]: body
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`
        }
      }).then((res) => {
        console.log('successfully updated');
        setInp(false);
        axios.post('https://cms-backend-five.vercel.app/api/log/createLogs', {
            id: user?.username,
            message: type+' Updated for ' + selectedOption,
        }, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${user?.accessToken}`
        }}).then((res) => {
            console.log('Notification sent');
        }).catch((error) => {
            console.log('Error:', error);
        });
        setMedicInp('');
        // window.location.reload();
      }).catch((err) => {
        console.log('err', err);
      })
    } catch (error) {
      console.log('error', error);
    }
  }



  return (
    <Box sx={{ p: 5 }}>
      {/* <DrawerHeader /> */}

      <Typography variant='h4' sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>Employee Details</Typography>

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

      <Box>

        <Box className='inj-data'>
          <Box className='box-1' sx={{ p: 3, display: { xl: 'block', lg: 'block', md: 'grid', sm: 'grid' }, gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
            {selectedDetails && (
              <Box>
                <h1>{selectedDetails.name}</h1>
              </Box>
            )}
            {selectedDetails && (
              <Box sx={{ my: 3 }}>
                <h3>Health Score : </h3>
                <progress id="injury" className='jawaan-health-score' value={healthSc} max="100"></progress>
                <br />
                <label htmlFor="injury">{healthSc}%</label>
                <Box sx={{ my: 3 }}>
                  <input type='button' value='Download Past Records' className='btns' onClick={handleDownload} />
                </Box>
              </Box>

            )}
          </Box>
          <Box className='box-2'>
            {selectedDetails && (
              <Box sx={{ p: 3 }}>
                <h1>Health: {healthCond}</h1>
                <Accordion sx={{ my: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Medications</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                    <Typography>
                      {inp && type==='medications' ? <Box style={{display: 'flex'}}>
                        <input type="text" name="" id="" className='inp-edit' value={medicInp} onChange={(e)=> setMedicInp(e.target.value)}  />
                        <button className='btns-edit' onClick={sendMsg}>update</button>
                      </Box> : selectedDetails.medications.map((med) => {
                      return <li>{med}</li>})
                      }
                      {/* This area contains medication */}
                    </Typography>
                    <Typography style={{justifySelf: 'end', fontWeight: 'bold', color: '#318cfe', textDecoration: 'underline', cursor: 'pointer'}} onClick={()=>{editMsg('medications', selectedDetails.medications)}}>
                      Edit
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ my: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Treatments</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                    <Typography>
                      {inp && type==='treatments' ? <Box style={{display: 'flex'}}>
                        <input type="text" name="" id="" className='inp-edit' value={medicInp} onChange={(e)=> setMedicInp(e.target.value)}  />
                        <button className='btns-edit' onClick={sendMsg}>update</button>
                      </Box> : selectedDetails.treatments.map((med) => {
                      return <li>{med}</li>})}
                    </Typography>
                    <Typography style={{justifySelf: 'end', fontWeight: 'bold', color: '#318cfe', textDecoration: 'underline', cursor: 'pointer'}} onClick={()=>{editMsg('treatments', selectedDetails.treatments)}}>
                      Edit
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ my: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Past Injuries</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                    <Typography>
                      No of Injuries. {inp && type==='past_injuries' ? <Box style={{display: 'flex'}}>
                        <input type="text" name="" id="" className='inp-edit' value={medicInp} onChange={(e)=> setMedicInp(e.target.value)}  />
                        <button className='btns-edit' onClick={sendMsg}>update</button>
                        </Box> : <span>{selectedDetails.past_injuries}</span>}
                    </Typography>
                    <Typography style={{justifySelf: 'end', fontWeight: 'bold', color: '#318cfe', textDecoration: 'underline', cursor: 'pointer'}} onClick={()=>{editMsg('past_injuries', selectedDetails.past_injuries)}}>
                      Edit
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ my: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Records of Hospitilisation</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                    <Typography>
                    Past Records of Hospitilisation {inp && type==='hospitalization_records' ? <Box style={{display: 'flex'}}>
                        <input type="text" name="" id="" className='inp-edit' value={medicInp} onChange={(e)=> setMedicInp(e.target.value)}  />
                        <button className='btns-edit' onClick={sendMsg}>update</button>
                        </Box> : <span>{selectedDetails.hospitalization_records}</span>}
                    </Typography>
                    <Typography style={{justifySelf: 'end', fontWeight: 'bold', color: '#318cfe', textDecoration: 'underline', cursor: 'pointer'}} onClick={()=>{editMsg('hospitalization_records', selectedDetails.hospitalization_records)}}>
                      Edit
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ my: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Prescribtions</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                    <Typography>
                      {inp && type==='prescriptions' ? <Box style={{display: 'flex'}}>
                        <input type="text" name="" id="" className='inp-edit' value={medicInp} onChange={(e)=> setMedicInp(e.target.value)}  />
                        <button className='btns-edit' onClick={sendMsg}>update</button>
                      </Box> : selectedDetails.prescriptions.map((med) => {
                      return <li>{med}</li>})}
                    </Typography>
                    <Typography style={{justifySelf: 'end', fontWeight: 'bold', color: '#318cfe', textDecoration: 'underline', cursor: 'pointer'}} onClick={()=>{editMsg('prescriptions', selectedDetails.prescriptions)}}>
                      Edit
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ my: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Injury Reports</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                    <Typography>
                      {inp && type==='injury_reports' ? <Box style={{display: 'flex'}}>
                        <input type="text" name="" id="" className='inp-edit' value={medicInp} onChange={(e)=> setMedicInp(e.target.value)}  />
                        <button className='btns-edit' onClick={sendMsg}>update</button>
                      </Box> : selectedDetails.injury_reports.map((med) => {
                      return <li>{med}</li>})}
                    </Typography>
                    <Typography style={{justifySelf: 'end', fontWeight: 'bold', color: '#318cfe', textDecoration: 'underline', cursor: 'pointer'}} onClick={()=>{editMsg('injury_reports', selectedDetails.injury_reports)}}>
                      Edit
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </Box>
          <Box className='box-3' sx={{ p: 3 }}>
            {selectedDetails && (
              <Box>
                <h1>Vitals</h1>
                <Box className='box-3-child'>
                  <Box sx={{ my: 2 }}>
                    <Typography>Spo2</Typography>
                    <Typography variant='h5' className='values'>{vitalsData.spo2}
                    </Typography>
                  </Box>

                  <Box sx={{ my: 2 }}>
                    <Typography>Heart Rate</Typography>
                    <Typography variant='h5' className='values'>{vitalsData.heartRate}
                    </Typography>
                  </Box>

                  <Box sx={{ my: 2 }}>
                    <Typography>Body Temperature</Typography>
                    <Typography variant='h5' className='values'>{vitalsData.bodyTemperature}
                    </Typography>
                  </Box>

                  <Box sx={{ my: 2 }}>
                    <Typography>Respiratory Rate</Typography>
                    <Typography variant='h5' className='values'>{vitalsData.respiratoryRate}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}


          </Box>
        </Box>

        <Box className='other-details'>
          {selectedDetails && (
            <Box className='records-grid-2'>
              <Box className='records-grid-child'>
                <Container sx={{ width: '90%', marginTop: '20px' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
                      <Tab label="Heart Rate Data" {...a11yProps(0)} />
                      <Tab label="Spo2 Data" {...a11yProps(1)} wrapped />
                      <Tab label="Respiratory Rate" {...a11yProps(2)} wrapped />
                      <Tab label="Body Temperature" {...a11yProps(3)} />
                      <Tab label="Altitude" {...a11yProps(4)} wrapped />
                    </Tabs>
                  </Box>
                  <CustomTabPanel value={value} index={0}>
                    <Typography variant='h6' sx={{ mb: 2 }}>Heart Rate Data</Typography>
                    <Line data={HRData} options={optHR} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <Typography variant='h6' sx={{ mb: 2 }}>Spo2 Data</Typography>
                    <Line data={Spo2Data} options={optSpo2} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <Typography variant='h6' sx={{ mb: 2 }}>Respiratory Rate</Typography>
                    <Line data={rrData} options={optRR} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={3}>
                    <Typography variant='h6' sx={{ mb: 2 }}>Body Temperature</Typography>
                    <Line data={tempData} options={optTemp} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={4}>
                  <Typography variant='h6' sx={{mb: 2}}>Altitude</Typography>
                  <Line data={ALData} options={optAL} />
                </CustomTabPanel>
                </Container>
              </Box>

            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
