import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from './Features/UserAuth/UserSlice';
import Select from 'react-select';
import Dialog from '@mui/material/Dialog';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DoneIcon from '@mui/icons-material/Done';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';
import { Typography } from '@mui/material';


export default function AlertModal() {

    const user = useSelector(selectUser);
    // const [showPopup, setShowPopup] = useState(false);
    const [animatePopup, setAnimatePopup] = useState(false);

    const [allDevs, setAllDevs] = useState([]);
    const [nameToClose, setNameToClose] = useState(null);
    const [idToClose, setIdToClose] = useState(null);
    
    const [allAlerts, setAllAlerts] = useState([]);

    // const receivedMsg = [ 'Help' , 'Yes' , 'No' , 'Pending' , 'Resolved' , 'Emergency' ]

    useEffect(() => {
        // api call for loading the error messages
        const fetchMsg = async () => {
            await axios.get('https://cms-backend-five.vercel.app/api/alert/readAlert', {
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.accessToken}`
                }
            }).then((res) => {
                // console.log('alll Alerts:', res.data.mssg);
                setAllDevs(res.data.mssg);
                

                // setDevMsgID(res.data.mssg.messageId);
            }).catch((error) => {
                console.log('Error:', error);
            });
        }
        fetchMsg();
        setTimeout(() => {
            setAnimatePopup(true);
        }, 500); // slight delay to trigger animation
    }, [allDevs, user?.accessToken]);
    
    useEffect(() => {
        // api call for loading the error messages
        const fetchMsg = async () => {
            await axios.get('https://cms-backend-five.vercel.app/api/alert/readEvacAlert', {
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.accessToken}`
                }
            }).then((res) => {
                // console.log('alll Alerts:', res.data.mssg);
                setAllAlerts(res.data.mssg);
                // setDevMsgID(res.data.mssg.messageId);
            }).catch((error) => {
                console.log('Error:', error);
            });
        }
        fetchMsg();
        setTimeout(() => {
            setAnimatePopup(true);
        }, 500); // slight delay to trigger animation
    }, [allAlerts, user?.accessToken]);

    // console.log('log->',deviceId);
    // console.log('all->',allDeviceIds);

    const [open1, setOpen1] = useState(false);
    const [msg, setMsg] = useState('');


    const handleClickOpen1 = (item) => {
        // console.log('msg ID:', item);
        setNameToClose(item.jawaanId);
        setIdToClose(item.messageId);
        setOpen1(true);
    };
    const handleClose1 = () => {
        setOpen1(false);
        // setAnimatePopup(false);
    };

    const messageChoosen = (opts) => {
        setMsg(opts);
    }

    const messages = [
        { value: '0', label: 'Help' },
        { value: '1', label: 'Yes' },
        { value: '2', label: 'No' },
        { value: '3', label: 'Pending' },
        { value: '4', label: 'Resolved' },
        { value: '5', label: 'Emergency' }
    ];

    const clear = () => {
        handleClose1();
        setMsg('');
        // setIdToClose('');
    }

    const sendMsg = (e) => {
        e.preventDefault();
        try {
            // console.log('---------------');
            // console.log({ jawaanId: nameToClose, message: msg?.value});
            // console.log('---------------');
            // api call for replying the error messages
            axios.post(`https://cms-backend-five.vercel.app/api/alert/swTowatch`, {
                jawaanId: nameToClose,
                message: msg?.value
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.accessToken}`
                }
            }).then((res) => {
                console.log('Message send');
                // api call for making the replied error messages mark as read
                axios.put(`https://cms-backend-five.vercel.app/api/alert/readedWTosw/${idToClose}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.accessToken}`
                }}).then((res) => {
                    console.log('Updates done ->', res);
                    axios.post('https://cms-backend-five.vercel.app/api/log/createLogs', {
                        id: user?.username,
                        message: 'Alert resolved for : ' + nameToClose,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${user?.accessToken}`
                    }}).then((res) => {
                        console.log('Notification sent');
                    }).catch((error) => {
                        console.log('Error:', error);
                    });
                }).catch((error) => {
                    console.log('Error:', error);
                });
            }).catch((error) => {
                console.log('Error:', error);
            });
            handleClose1();
            setMsg('');
        } catch (error) {
            console.log('Error:', error);
        }
    }

    const resolve = (e, req, name) => {
        e.preventDefault();
        try {
            axios.put(`https://cms-backend-five.vercel.app/api/alert/readedEvac/${req}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.accessToken}`
            }}).then((res) => {
                console.log('Updates done for tick');
                // console.log('Updates done for tick ->', res);
                axios.post('https://cms-backend-five.vercel.app/api/log/createLogs', {
                        id: user?.username,
                        message: 'Alert resolved for : ' + name,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${user?.accessToken}`
                    }}).then((res) => {
                        console.log('Notification sent');
                    }).catch((error) => {
                        console.log('Error:', error);
                    });
            }).catch((error) => {
                console.log('Error:', error.message);
            });
        } catch (error) {
            console.log('Error:', error.message);
        }
    }

    const resolve2 = (e, msg, name) => {
        e.preventDefault();
        try {
            axios.put(`https://cms-backend-five.vercel.app/api/alert/readedWTosw/${msg}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.accessToken}`
                }}).then((res) => {
                    console.log('Updates done ->', res);
                    axios.post('https://cms-backend-five.vercel.app/api/log/createLogs', {
                        id: user?.username,
                        message: 'Alert resolved for : ' + name,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${user?.accessToken}`
                    }}).then((res) => {
                        console.log('Notification sent');
                    }).catch((error) => {
                        console.log('Error:', error);
                    });
                }).catch((error) => {
                    console.log('Error:', error);
                });
        } catch (error) {
            console.log('Error:', error.message);
        }
    }


return (
    <>
        <>
            {user?.role==='admin' && allAlerts?.filter((item) => {
                if(item.resolved === false){
                    return item;
                }
                return null;
            }).map((item, index) => {
                let topPosition = 1 + index * 10;
                if (window.innerWidth <= 1850) {
                    topPosition = 1 + index * 15; // More space between toasts for tablets
                } else if (window.innerWidth <= 1500) {
                    topPosition = 1 + index * 15; // More space between toasts for tablets
                } else if (window.innerWidth <= 480) {
                    topPosition = 1 + index * 20; // Even more space for mobile devices
                }

                return (
                    <>
                        <div
                            className='popup3'
                            key={index}
                            style={{ right: animatePopup ? '35%' : '-100%', top: topPosition + '%' }}
                        >
                            <Typography variant='h6'><strong>{parseInt(item.no_of_patients) < 10 ? ("0" + item.no_of_patients) : (item.no_of_patients)}</strong> - {item.request}</Typography>
                            <Typography variant='h6' style={{display:'flex', alignItems: 'center', gap: '5px'}}><AccountCircleIcon style={{ color: '', borderRadius: '50%' }} /> {item.id} <DoneIcon style={{ marginLeft: '30px', cursor: 'pointer'}} onClick={(e)=>{resolve(e, item.messageId, item.id)}} /></Typography>
                        </div>
                    </>
                );
            })}
        </>


        <>
        {allDevs?.filter((item) => {
            if(item.resolved === false){
                return item;
            }
            return null;
        }).map((item, index) => {

            return (
                    <div
                        className='popup'
                        key={index}
                        style={{ right: animatePopup ? '1%' : '-100%', top: `${2+(index * 11)}%` }}
                    >
                        <ErrorOutlineIcon style={{ color: 'red', borderRadius: '50%', marginTop: '6px' }} />
                        <Typography variant='h6' style={{alignSelf: 'baseline'}}>{item.jawaanId} - {item.message}</Typography>
                        <div>
                            <MessageIcon style={{ marginLeft: '30px', cursor: 'pointer'}} onClick={() => handleClickOpen1(item)} />
                            <DoneIcon style={{ marginLeft: '30px', cursor: 'pointer'}} onClick={(e)=>{resolve2(e, item.messageId, item.jawaanId)}} />
                        </div>
                    </div>
            );
        })}

        <div>
            <Dialog open={open1}>
                <div style={{margin: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                    <Typography variant='h5' align='center' my={2}>Sending Message to {nameToClose}</Typography>
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
        </div>
    </>
    </>
)
}
