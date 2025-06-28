import React, { useState } from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { selectUser } from './Features/UserAuth/UserSlice';

export default function DeviceAdd({ open, onClose }) {

    const user = useSelector(selectUser);


    const [macID1, setMacID1] = useState('');
    const [macID2, setMacID2] = useState('');
    const [macID3, setMacID3] = useState('');
    const [macID4, setMacID4] = useState(''); 
    const [macID5, setMacID5] = useState('');
    const [macID6, setMacID6] = useState('');
    const macID = macID1+":"+macID2+":"+macID3+":"+macID4+":"+macID5+":"+macID6;

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('Form data:', formData);
        // console.log('Mac ID:', macID);
        console.log('Device saving...');
        try{
            await axios.post('https://cms-backend-five.vercel.app/api/device/createDevice', { macId : macID }, 
                {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": `Bearer ${user?.accessToken}`
                }}
            ).then((res) => {
                console.log('Device created successfully');
                // notifysuccess();
                onClose();
                setMacID1('');
                setMacID2('');
                setMacID3('');
                setMacID4('');
                setMacID5('');
                setMacID6('');
                axios.post('https://cms-backend-five.vercel.app/api/log/createLogs', {
                    id: user?.username,
                    message: 'New Device Added with MAC ID: ' + macID,
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

        } catch(err){
            console.log(err);
        }
        // try {
        //     if (macID === '') {
        //         alert('Please fill all the fields');
        //         return;
        //     }
        //     const response =
        //         await axios.post('https://cms-backend-five.vercel.app/api/device/add', 
        //         {
        //             macID: macID
        //         }
        //     );

        //     console.log(response.data);

        //     if (response.status === 200) {
        //         toast.success('Device Added Successfully');
        //         setMacID('');
        //     }

        // } catch (error) {
        //     console.log('Error:', error);
        //     toast.error('Error Adding Device');
        // }
    }

    const close = () => {
        onClose();
        setMacID1('');
        setMacID2('');
        setMacID3('');
        setMacID4('');
        setMacID5('');
        setMacID6('');
    }

    const notifysuccess = () => {toast.success("Device Successfully added", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    })}


    return (
        <>
        <ToastContainer />
        <Dialog open={open} onClose={onClose} fullWidth
            style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Poppins', 
                }
            }
        >


            <DialogTitle fontStyle={{
                fontSize: 25,
                fontWeight: 600,
                fontFamily: 'Poppins',
                color: "primary"
            }}>Add New Device</DialogTitle>
            <DialogContent >
                <form onSubmit={handleSubmit}>

                    {/* Medic Name */}
                    <Typography variant='h6'>Enter a Mac ID : </Typography>
                    <input
                        type='text'
                        placeholder='XX'
                        value={macID1}
                        minLength='2'
                        maxLength='2'
                        style={{padding: '10px', borderRadius: '10px', border: '1px solid grey', width: '50px', textAlign: 'center'}}
                        onChange={(e) => { setMacID1(e.target.value) }}
                    />
                    <span> : </span>
                    <input
                        type='text'
                        placeholder='XX'
                        value={macID2}
                        minLength='2'
                        maxLength='2'
                        style={{padding: '10px', borderRadius: '10px', border: '1px solid grey', width: '50px', textAlign: 'center'}}
                        onChange={(e) => { setMacID2(e.target.value) }}
                    />
                    <span> : </span>
                    <input
                        type='text'
                        placeholder='XX'
                        value={macID3}
                        minLength='2'
                        maxLength='2'
                        style={{padding: '10px', borderRadius: '10px', border: '1px solid grey', width: '50px', textAlign: 'center'}}
                        onChange={(e) => { setMacID3(e.target.value) }}
                    />
                    <span> : </span>
                    <input
                        type='text'
                        placeholder='XX'
                        value={macID4}
                        minLength='2'
                        maxLength='2'
                        style={{padding: '10px', borderRadius: '10px', border: '1px solid grey', width: '50px', textAlign: 'center'}}
                        onChange={(e) => { setMacID4(e.target.value) }}
                    />
                    <span> : </span>
                    <input
                        type='text'
                        placeholder='XX'
                        value={macID5}
                        minLength='2'
                        maxLength='2'
                        style={{padding: '10px', borderRadius: '10px', border: '1px solid grey', width: '50px', textAlign: 'center'}}
                        onChange={(e) => { setMacID5(e.target.value) }}
                    />
                    <span> : </span>
                    <input
                        type='text'
                        placeholder='XX'
                        value={macID6}
                        minLength='2'
                        maxLength='2'
                        style={{padding: '10px', borderRadius: '10px', border: '1px solid grey', width: '50px', textAlign: 'center'}}
                        onChange={(e) => { setMacID6(e.target.value) }}
                    />

                </form>
            </DialogContent>


            {/* Action Buttons */}
            <DialogActions >
                <Button onClick={close}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Add +</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}
