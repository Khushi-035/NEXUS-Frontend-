import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ErrorIcon from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import Dialog from '@mui/material/Dialog';
import { useSelector } from 'react-redux';
import { selectUser } from './Features/UserAuth/UserSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


export default function UniversalLog(props) {
    const { Empid, data } = props;
    const user = useSelector(selectUser);

    const [open1, setOpen1] = useState(false);
    const [msg, setMsg] = useState('');
    
    const messages = [
        { value: '0', label: 'Help' },
        { value: '1', label: 'Yes' },
        { value: '2', label: 'No' },
        { value: '3', label: 'Pending' },
        { value: '4', label: 'Resolved' },
        { value: '5', label: 'Emergency' }
    ];

    const [count, setCount] = useState(0);
    const [info, setInfo] = useState(false);
    const [inpVal, setInpVal] = useState('');
    const [empId, setEmpId] = useState('');
    const [idToClose, setIdToClose] = useState('');
    // const [healthStatus, setHealthStatus] = useState('');
    const [showAlert, setShowAlert] = useState(false); // State to control alert modal visibility
    const [currentDeviceId, setCurrentDeviceId] = useState([]); // State to store the current device ID


    // console.log('Data:', data);

    useEffect(() => {

        handleCriticalEvent();
        if (data) {
            // Check for critical events in the data
            // console.log('Data received in UniversalLog:');

            // for Keeping the counter for all the Employees in Dangerous state
            // let prevState = 0;
            // data.map((item, index) => {
            //     const status = healthCondFunc(item.uid);
            //     if (item.uid && status === 'Critical') {    // If the health status is critical but for now Dangerous
            //         prevState += 1;
            //     }
            // });
            // setCount(prevState);


            data.map((item, index) => {
                // console.log(item.uid);
                const status = healthCondFunc(item.uid);
                if (status === 'Critical') {
                    // console.log(item.uid, 'in dangerous state');
                    setCurrentDeviceId((prevState) => {
                        if (item.uid && !prevState.includes(item.uid)) {
                            return [...prevState, item.uid];
                        }
                        return prevState;
                    });

                    console.log('Critical event detected');
                    // Call the function to handle critical event
                    // handleCriticalEvent();
                    setShowAlert(true);
                }
            });
        }
    }, [data]);

    const sendEmpId = (id) => {
        setEmpId(id);
        Empid(id);
        setInfo(false);
    };

    // const redirectTo = (uid) => {
    //     dispatch(setEmpName({ emp: uid }));
    //     navigate('/EmployeeDetails');
    // }

    const danger = {
        backgroundColor: '#f77e7e',
        border: '1px solid black',
        padding: '3px'
    };
    const warning = {
        backgroundColor: 'yellow',
        border: '1px solid black',
        padding: '3px'
    };
    const success = {
        backgroundColor: 'lightgreen',
        border: '1px solid black',
        padding: '3px'
    };

    const selColor = (status) => {
        if (status === 'Stable') {
            return success;
        } else if (status === 'Dangerous') {
            return warning;
        } else {    // Critical 
            return danger;
        }
    };

    const healthCondFunc = (name) => {
        let status = data ? data.find(d => d.uid === name) : '';
        
        let hr = status?.heartRate;
        let hr_score = 0;
        if (hr >= 51 && hr <= 90)
            hr_score = 3    // Stable
        else if ((hr >= 40 && hr <= 50) || (hr >= 91 && hr <= 110))
            hr_score = 2
        else if (hr < 40 || hr >= 110)
            hr_score = 1
        
        
        let spo2 = status?.spo2;
        let spo2_score = 0;
        if (spo2 >= 96 && spo2 <= 100)
            spo2_score = 2
        else if (spo2 >= 91 && spo2 <= 95)
            spo2_score = 1
        else if (spo2 < 91)
            spo2_score = 0

        let temp = status?.bodyTemperature;
        let temp_score = 0;
        if (temp >= 36.1 && temp <= 38.0)
            temp_score = 1
        else if (temp < 36.1 || temp > 38.0)
            temp_score = 0
        
        let rr = status?.respiratoryRate;
        let rr_score = 0;
        if (rr >= 8 && rr <= 16)
            rr_score = 2
        else if (rr < 8 && rr > 16)
            rr_score = 1
        else
            rr_score = 0


        let Modified_NEWS = (rr_score * 0.2) + (spo2_score * 0.2) + (temp_score * 0.15) + (hr_score * 0.3)
        // (AVPU score * AVPU weight) 

        let TOTAL_HEALTH_SCORE = (Modified_NEWS / 2.15) * 100

        if (parseInt(TOTAL_HEALTH_SCORE) >= 70 && parseInt(TOTAL_HEALTH_SCORE) <= 100) {
            return 'Stable';
        } else if (parseInt(TOTAL_HEALTH_SCORE) > 40 && parseInt(TOTAL_HEALTH_SCORE) < 70) {
            return 'Dangerous';
        } else {
            return 'Critical';
        }

    };

    const healtStatus = (name) => {
        let status = data ? data.find(d => d.uid === name) : '';

        let desc = [];

        let hr = status?.heartRate;
        if(hr >= 60 && hr <= 100){
            // hr = 'Normal';
            desc.push('HR - Normal');
        } else if(hr < 60 && hr >= 40){
            // hr = 'Dangerous';
            desc.push('HR - Dangerous');
        } else if(hr < 40){
            // hr = 'Critical';
            desc.push('HR - Critical');
        }

        let spo2 = status?.spo2;
        if(spo2 >= 95 && spo2 <= 100){
            // spo2 = 'Normal';
            desc.push('SpO2 - Normal');
        } else if(spo2 < 95 && spo2 >= 85){
            // spo2 = 'Dangerous';
            desc.push('SpO2 - Dangerous');
        } else if(spo2 < 85){
            // spo2 = 'Critical';
            desc.push('SpO2 - Critical');
        }

        let temp = status?.bodyTemperature;
        if(temp >= 35.6 && temp <= 37.2){
            // temp = 'Normal';
            desc.push('Temp - Normal');
        } else if(temp >= 35 && temp <= 38){
            // temp = 'Dangerous';
            desc.push('Temp - Dangerous');
        } else {
            // temp = 'Critical';
            desc.push('Temp - Critical');
        }

        let aqi = status?.environment.aqi;
        if(aqi >= 0 && aqi <= 50){
            // aqi = 'Normal';
            desc.push('AQI - Normal');
        } else if(aqi >= 101 && aqi <= 150){
            // aqi = 'Dangerous';
            desc.push('AQI - Dangerous');
        } else if(aqi > 201){
            // aqi = 'Critical';
            desc.push('AQI - Critical');
        }

        let voc = status?.environment.voc;
        if(voc <= 0.3){
            // voc = 'Normal';
            desc.push('VOC - Normal');
        } else if(voc >= 0.5 && voc <= 1){
            // voc = 'Dangerous';
            desc.push('VOC - Dangerous');
        } else if(voc > 1){
            // voc = 'Critical';
            desc.push('VOC - Critical');
        }

        let dew = status?.environment.dewPoints;
        if(dew <= 60){
            // dew = 'Normal';
            desc.push('DEW Points - Normal');
        } else if(dew >= 66 && dew <= 70){
            // dew = 'Dangerous';
            desc.push('DEW Points - Dangerous');
        } else if(dew >= 70){
            // dew = 'Critical';
            desc.push('DEW Points - Critical');
        }

        return desc;
    }

    // Sort the data by health status from critical to stable
    const sortedData = data && data.slice().sort((a, b) => {
        const statusA = healthCondFunc(a.uid);
        const statusB = healthCondFunc(b.uid);
        if (statusA === 'Critical' && statusB !== 'Critical') {
            return -1;
        } else if (statusA !== 'Critical' && statusB === 'Critical') {
            return 1;
        } else if (statusA === 'Stable' && statusB !== 'Stable') {
            return 1;
        } else if (statusA !== 'Stable' && statusB === 'Stable') {
            return -1;
        } else {
            return 0;
        }
    });

    const handleClickOpen1 = (item) => {
        setIdToClose(item);
        setOpen1(true);
    };
    const handleClose1 = () => {
        setOpen1(false);
    };
    const messageChoosen = (opts) => {
        setMsg(opts);
    }

    const clear = () => {
        handleClose1();
        setMsg('');
        // setIdToClose('');
    }

    const sendMsg = (e) => {
        e.preventDefault();
        try {
            // console.log('---------------');
            // console.log('nameToClose:', nameToClose);
            // console.log('msg:', msg?.value);
            // console.log('---------------');
            // post
            axios.post(`https://cms-backend-five.vercel.app/api/alert/swTowatch`, {
                jawaanId: idToClose,
                message: msg?.value
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.accessToken}`
                }
            }).then((res) => {
                console.log('Message send');
                handleClose1();
                axios.post('https://cms-backend-five.vercel.app/api/log/createLogs', {
                    id: user?.username,
                    message: 'Message Sent to ' + idToClose + ' by ' + user?.username,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user?.accessToken}`
                }}).then((res) => {
                    console.log('Notification sent');
                }).catch((error) => {
                    console.log('Error:', error);
                });
                setMsg('');
                setIdToClose('');
            }).catch((error) => {
                console.log('Error:', error);
            });
        } catch (error) {
            console.log('Error:', error);
        }
    }

    // Function to handle critical event
    const handleCriticalEvent = () => {
        // Set showAlert to true to display the alert modal
        setShowAlert(true);
    };
    return (
        <>
            <Dialog open={open1}>
                <div style={{margin: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                    <Typography variant='h5' align='center' my={2}>Sending Message to {idToClose}</Typography>
                    <form onSubmit={sendMsg}>
                        <Select
                            // defaultValue={opt}
                            // isMulti
                            name="messages"
                            options={messages}
                            onChange={messageChoosen}
                            value={msg}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Message..."
                            required
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: base => ({
                                    ...base,
                                    zIndex: 9999
                                })
                            }}
                        />
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <input type='button' value='Close' onClick={clear} className='btns' style={{width: '95%', marginTop: '20px'}} />
                            <button className='btns' style={{width: '95%', marginTop: '20px'}}>Send</button>
                        </div>
                    </form>
                </div>
            </Dialog>


            {info &&
                <div style={{ position: 'fixed', right: '1%', bottom: '8%', width: '40%', zIndex: 5, backgroundColor: 'white', border: '1px solid black', minHeight: '300px', maxHeight: '300px', overflowY: 'scroll', overflowX: 'hidden', margin: '0px' }}>
                    <Box sx={{ width: '95%', display: 'flex', m: 2 }}>
                        <input type="text" placeholder="Search by Device ID..." value={inpVal} onChange={(e) => { setInpVal(e.target.value) }}
                            className='inp-box inp-srch' />
                        {inpVal &&
                            <button className='btns cross' variant="contained" onClick={() => { setInpVal('') }}><CloseIcon /></button>
                        }
                    </Box>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ position: 'relative' }}>Device ID</th>
                                    <th style={{ position: 'relative' }}>Message Type</th>
                                    <th style={{ position: 'relative' }}>Message Desc</th>
                                    <th style={{ position: 'relative' }}>Send Msg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData ? sortedData.filter((s) => {
                                    if (inpVal === '' && s.uid !== '') {
                                        return s;
                                    }
                                    else if (s.deviceId.toLowerCase().includes(inpVal.toLowerCase()) && s.uid !== '') {
                                        return s;
                                    }
                                }).map((d) => {
                                    const status = healthCondFunc(d.uid);
                                    if (status) {
                                        return (
                                            <tr key={d.uid}>
                                                <td style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => { sendEmpId(d.deviceId) }}>{d.deviceId}</td>
                                                {/* <td><strong style={selColor(status)}>{status}</strong></td> */}
                                                <td>
                                                    {(() => {
                                                        const statuses = healtStatus(d.uid);
                                                        if (statuses.some(item => item.includes('Critical'))) {
                                                        // If there's at least one 'Critical', display 'Critical'
                                                        return <strong style={selColor('Critical')}>Critical</strong>;
                                                        } else if (statuses.some(item => item.includes('Dangerous'))) {
                                                        // If there's no 'Critical', but there's 'Dangerous', display 'Dangerous'
                                                        return <strong style={selColor('Dangerous')}>Dangerous</strong>;
                                                        } else {

                                                        // If neither 'Critical' nor 'Dangerous' is found, display 'Stable'
                                                        return <strong style={selColor('Stable')}>Stable</strong>;
                                                        }
                                                    })()}
                                                    </td>
                                                <td>{healtStatus(d.uid).map((item, index) => {
                                                    return (
                                                        <p><strong key={index}>{item}</strong></p>
                                                    );
                                                })}</td>
                                                <td><button className='btns' style={{fontSize: '14px'}} onClick={() => handleClickOpen1(d.uid)}>Send Msg</button></td>
                                            </tr>
                                        );
                                    }
                                })
                                    : (
                                        <tr>
                                            <td><span>--</span></td>
                                            <td>--</td>
                                            <td>--</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            }

            <div>
                <ErrorIcon onClick={() => { setInfo(!info) }} sx={{ border: '1px solid black', backgroundColor: 'white', p: 1, fontSize: '70px', borderRadius: '50%', position: 'fixed', right: '1%', bottom: '1%', marginRight: '20px' }} />
                {/* <span style={{padding: '5px 12px', backgroundColor: 'dodgerblue', color: 'white', borderRadius: '50%', position: 'fixed', right: '0.5%', bottom: '6%', marginRight: '20px'}}>{count}</span> */}
            </div>

        </>
    )
}
