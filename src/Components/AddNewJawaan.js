import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser } from './Features/UserAuth/UserSlice';
import { rmEmpName } from './Features/EmpDetails/EmpSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const JawaanAdd = ({ open, onClose, data }) => {

    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const navigate = useNavigate();


    const notifyerror = () => {toast.error("Please fill all the details", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });}

    const notifysuccess = () => {toast.success("Employee Successfully added", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    })}

    const [view, setView] = useState(false);    // for showing/hiding the options
    const toggleHandler = () => setView(!view);
    const [selectedOption, setSelectedOption] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        id: '',
        deviceId: '',
        condition: '',
        medications: [''],
        treatments: [''],
        past_injuries: 0,
        hospitalization_records: 0,
        prescriptions: [''],
        injury_reports: [''],
        share_token: 'manual'+Math.floor(Math.random() * 1000)
    });

    const handleChange = (e, index, field) => {
        const { value } = e.target;
        const updatedData = { ...formData };
        updatedData[field][index] = value;
        setFormData(updatedData);
    };

    const handleAddInput = (field) => {
        const updatedData = { ...formData };
        updatedData[field].push('');
        setFormData(updatedData);
    };

    const handleRemoveInput = (field, index) => {
        const updatedData = { ...formData };
        updatedData[field].splice(index, 1);
        setFormData(updatedData);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        console.log('Form data:', formData);
        try {
            console.log('Employee data saving...');


            // Check all the field 

            if (formData.name === '' || formData.id === '' || formData.deviceId === '' || formData.condition === '' || formData.medications[0] === '' || formData.treatments[0] === '' || formData.past_injuries === 0 || formData.hospitalization_records === 0 || formData.prescriptions[0] === '' || formData.injury_reports[0] === '') {
                notifyerror();
                return;
            }

            // Send the form data to the server
            AddNewJawaan();


        } catch (error) {
            console.error('Error adding Employee:', error);
        }
    };

    const AddNewJawaan = () => {

        // console.log('User:', user);
        try {
            axios.post('https://cms-backend-five.vercel.app/api/jawaan/add', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.accessToken}`
                }
            }).then((response) => {
                console.log('Employee data saved');

                // notifysuccess();
                onClose();
                
                axios.post('https://cms-backend-five.vercel.app/api/log/createLogs', {
                    id: user?.username,
                    message: `New Employee added with ID: ${formData.id} and Name: ${formData.name}`
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user?.accessToken}`
                }}).then((res) => {
                    console.log('Notification sent');
                }).catch((error) => {
                    console.log('Error:', error);
                });

                setFormData({
                    name: '',
                    id: '',
                    deviceId: '',
                    condition: '',
                    medications: [''],
                    treatments: [''],
                    past_injuries: 0,
                    hospitalization_records: 0,
                    prescriptions: [''],
                    injury_reports: [''],
                    share_token: ''
                });
                setSelectedOption('');


                window.location.reload();
        }).catch((error) => {
            console.error('Error adding Employee:', error);
        });
        } catch (error) {
            console.error('Error adding Employee:', error);
        }
        // console.log('Employee data:', formData);
        
        // dispatch(logout());
        // dispatch(rmEmpName());
        // navigate('/login');
    }

    const close = () => {
        setFormData({
            name: '',
            id: '',
            deviceId: '',
            condition: '',
            medications: [''],
            treatments: [''],
            past_injuries: 0,
            hospitalization_records: 0,
            prescriptions: [''],
            injury_reports: [''],
            share_token: ''
        });
        setSelectedOption('');
        onClose();
    }

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
                    fontFamily: 'Poppins'
                }
            }
        >

            <ToastContainer />

            <DialogTitle fontStyle={{
                fontSize: 25,
                fontWeight: 600,
                fontFamily: 'Poppins',
                color: "primary"
            }}>Add New Employee Data</DialogTitle>
            <DialogContent >
                <form onSubmit={handleSubmit}>

                    {/* ID */}
                    <TextField
                        label="ID"
                        fullWidth
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        margin="normal"
                        required
                    />

                    {/* Name */}
                    <TextField
                        label="Name"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        margin="normal"
                        required
                    />

                    {/* Device ID */}
                    {/* <TextField
                        label="Device ID"
                        fullWidth
                        value={formData.deviceId}
                        onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                        margin="normal"
                        required
                    /> */}

            <Box sx={{ pb: 0, display: 'flex', mt: 3}}>
                <Box className='search-box'>
                    <Box className='search-tool-3' onClick={toggleHandler}>
                    {selectedOption ? selectedOption : 'Choose a Device'}
                    <ExpandMoreIcon />
                    </Box>
                    
                    {view && 
                    <ul className='name-lists'>
                        {data ? data.filter((emp) => {
                            if(emp.uid === ""){
                                return emp;
                            }
                        }).map((emp, index)=>{
                        return (
                        <li key={index} onClick={() => { setSelectedOption(emp.deviceId); toggleHandler(); setFormData({ ...formData, deviceId: emp.deviceId }) }}>
                            {emp.deviceId}
                        </li>)
                    }): ''}
                    </ul>
                    }
                    
                </Box>
            </Box>



                    {/* Condition */}
                    <TextField
                        label="Condition"
                        fullWidth
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        margin="normal"
                        required
                    />

                    {/* Medications */}
                    <Typography variant='h6' fontWeight={500} gutterBottom >
                        Medications
                    </Typography>

                    {formData.medications.map((medication, index) => (
                        <Box key={index} display="flex" alignItems="center" mt={-1}>

                            <TextField
                                label={`Medication ${index + 1}`}
                                fullWidth
                                value={medication}
                                onChange={(e) => handleChange(e, index, 'medications')}
                                margin="normal"
                                required

                            />

                            {/* Remove Medication */}
                            {index !== 0 && (

                                <IconButton aria-label="delete" color="warning"
                                    onClick={() => handleRemoveInput('medications', index)}>
                                    <DeleteRoundedIcon />
                                </IconButton>

                            )}

                            {/* Add New Medication */}
                            {index === formData.medications.length - 1 && (

                                <IconButton aria-label="add" color="primary"
                                    onClick={() => handleAddInput('medications')}>
                                    <AddRoundedIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}

                    {/* Treatments */}
                    <Typography variant='h6' fontWeight={500} gutterBottom>
                        Treatments
                    </Typography>

                    {formData.treatments.map((treatment, index) => (

                        <Box key={index} display="flex" alignItems="center" mt={-1}>
                            <TextField
                                label={`Treatment ${index + 1}`}
                                fullWidth
                                value={treatment}
                                onChange={(e) => handleChange(e, index, 'treatments')}
                                margin="normal"
                                required
                            />

                            {/* Remove Treatment */}
                            {index !== 0 && (
                                <IconButton aria-label="delete" color="warning"
                                    onClick={() => handleRemoveInput('treatments', index)}>
                                    <DeleteRoundedIcon />
                                </IconButton>
                            )}

                            {/* Add New Treatment */}
                            {index === formData.treatments.length - 1 && (
                                <IconButton aria-label="add" color="primary"
                                    onClick={() => handleAddInput('treatments')}>
                                    <AddRoundedIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}

                    {/* Past Injuries */}
                    <TextField
                        label="Past Injuries (Number)"
                        fullWidth
                        type="number"
                        value={formData.past_injuries}
                        onChange={(e) => setFormData({ ...formData, past_injuries: e.target.value })}
                        margin="normal"
                        required
                    />

                    {/* Hospitalization Records */}

                    <TextField
                        label="Hospitalization Records (Number)"
                        fullWidth
                        type="number"
                        value={formData.hospitalization_records}
                        onChange={(e) => setFormData({ ...formData, hospitalization_records: e.target.value })}
                        margin="normal"
                        required
                    />



                    {/* Injury Reports */}
                    <Typography variant='h6' fontWeight={500} gutterBottom>
                        Injury Reports
                    </Typography>

                    {formData.injury_reports.map((report, index) => (
                        <Box key={index} display="flex" alignItems="center" mt={-1}>
                            <TextField
                                label={`Injury Report ${index + 1}`}
                                fullWidth
                                value={report}
                                onChange={(e) => handleChange(e, index, 'injury_reports')}
                                margin="normal"
                                required
                            />

                            {/* Remove Injury Report */}
                            {index !== 0 && (
                                <IconButton aria-label="delete" color="warning"
                                    onClick={() => handleRemoveInput('injury_reports', index)}>
                                    <DeleteRoundedIcon />
                                </IconButton>
                            )}

                            {/* Add New Injury Report */}
                            {index === formData.injury_reports.length - 1 && (
                                <IconButton aria-label="add" color="primary"
                                    onClick={() => handleAddInput('injury_reports')}>
                                    <AddRoundedIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}


                    {/* Prescriptions */}
                    <Typography variant='h6' fontWeight={500} gutterBottom >
                        Prescriptions
                    </Typography>

                    {formData.prescriptions.map((prescription, index) => (
                        <Box key={index} display="flex" alignItems="center" mt={-1}>
                            <TextField
                                label={`Prescription ${index + 1}`}
                                fullWidth
                                value={prescription}
                                onChange={(e) => handleChange(e, index, 'prescriptions')}
                                margin="normal"
                                required
                            />

                            {/* Remove Prescription */}
                            {index !== 0 && (
                                <IconButton aria-label="delete" color="warning"
                                    onClick={() => handleRemoveInput('prescriptions', index)}>
                                    <DeleteRoundedIcon />
                                </IconButton>
                            )}

                            {/* Add New Prescription */}
                            {index === formData.prescriptions.length - 1 && (
                                <IconButton aria-label="add" color="primary"
                                    onClick={() => handleAddInput('prescriptions')}>
                                    <AddRoundedIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}

                    {/* Share Token */}
                    {/* <TextField
                        label="Share Token"
                        fullWidth
                        value={formData.share_token}
                        onChange={(e) => setFormData({ ...formData, share_token: e.target.value })}
                        margin="normal"
                        required
                    /> */}





                </form>
            </DialogContent>


            {/* Action Buttons */}
            <DialogActions >
                <Button onClick={close}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Add Employee</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default JawaanAdd;
