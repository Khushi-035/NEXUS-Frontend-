import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { 
  // Grid, 
  Typography, 
  // Paper 
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from './Features/UserAuth/UserSlice';
import { ToastContainer, toast } from 'react-toastify';

// import { styled } from '@mui/material/styles';

// const DrawerHeader = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   justifyContent: 'flex-end',
// }));



export default function EvacuationDetails() {

  const user = useSelector(selectUser);

  const [evacDet, setEvacDet] = useState({
    request: '',
    no_of_patients: 0,
    additional: ''
  })
  const [support, setSupport] = useState({
    message: ''
  });
  const [val, setVal] = useState(0);

  // const [inpValue, setInpValue] = useState('');

  const incQ = () =>{
      // val++;
      setVal(Number(val)+1);
  }
  const decQ = () =>{
    if (val === 0) {
      return;
    }
    else{
      setVal(val-1);
    }
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;

      setEvacDet((prevData) => ({
        ...prevData,
        [name]: value !== undefined ? value : value,
      }));
  }
  
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;

      setSupport((prevData) => ({
        ...prevData,
        [name]: value !== undefined ? value : value,
      }));
  }

  
  // console.log(ambulance);

  
  const notifysuccess = () => {toast.success("Form submitted successfully", {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  })};

  
  const submit = async (e) =>{
    e.preventDefault();
    evacDet.no_of_patients = val;
    try{
      console.log("form submission started");
      if (!user || !user.accessToken || evacDet.request === '' || evacDet.no_of_patients === 0 || evacDet.additional === '') {
        // Handle the case when there is no valid access token
        console.error('Invalid or missing access token');
        return;
      }
      // console.log({request: evacDet.request,
      //   no_of_patients: evacDet.no_of_patients,
      //   message: evacDet.additional});
      // await axios.post('https://cms-backend-five.vercel.app/api/evacuation/submitEvacDetails', 
      await axios.post('https://cms-backend-five.vercel.app/api/alert/alertEvac', 
        {
          id: user?.username,
          request: evacDet.request,
          no_of_patients: evacDet.no_of_patients,
          message: evacDet.additional
        },
        { headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.accessToken}`
          }
        }
      )
      console.log('evacuation sent');
      // notifysuccess();
      console.log(evacDet);
      axios.post('https://cms-backend-five.vercel.app/api/log/createLogs', {
          id: user?.username,
          message: 'Evacuation Requested Successfully with Request: ' + evacDet.request + ' by ' + user?.username,
      }, {
          headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${user?.accessToken}`
      }}).then((res) => {
          console.log('Notification sent');
      }).catch((error) => {
          console.log('Error:', error);
      });
      setEvacDet({
        request: '',
        no_of_patients: 0,
        additional: ''
      })
      setVal(0);

    }
    catch(err){
      if (!err?.response) {
        console.log('No Server Response');
      } else if (err.response?.status === 400) {
        console.log('Invalid Credentials');
      } else if (err.response?.status === 401) {
        console.log('Unauthorized');
      } else {
        console.log('Invalid Credentials');
      }
    }
  }
  
  const sendSupport = async (e) =>{
    e.preventDefault();

    try{
      console.log('support sending started');
      if (!user || !user.accessToken || support.message === '') {
        // Handle the case when there is no valid access token
        console.error('Invalid or missing access token');
        return;
      }
      // console.log(user?.accessToken);
      await axios.post('https://cms-backend-five.vercel.app/api/evacuation/submitSupport', 
        support,
        { headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.accessToken}`
          }
        }
      )
      console.log("support send");
      // notifysuccess();
      axios.post('https://cms-backend-five.vercel.app/api/log/createLogs', {
          id: user?.username,
          message: 'Support Requested Successfully by ' + user?.username,
      }, {
          headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${user?.accessToken}`
      }}).then((res) => {
          console.log('Notification sent');
      }).catch((error) => {
          console.log('Error:', error);
      });
      // console.log(support);
      setSupport({
        message: ''
      });

    }
    catch(err){
      if (!err?.response) {
        console.log('No Server Response');
      } else if (err.response?.status === 400) {
        console.log('Invalid Credentials');
      } else if (err.response?.status === 401) {
        console.log('Unauthorized');
      } else {
        console.log('Invalid Credentials');
      }
    }
  }



  return (
    <Box sx={{p: 5}}>
      <ToastContainer />
      <Typography variant='h4' sx={{fontFamily: 'Poppins', fontWeight: 600, my: 3}}>Evacuation Details</Typography>

      <form onSubmit={submit}>

        <Box className='checks1 extra'>
          <Box sx={{display:'flex', alignItems: 'center'}}>
            <input type="radio" name="request" value="Request Mobile Ambulance" checked={evacDet.request === 'Request Mobile Ambulance'} onChange={handleInputChange} />
            <label htmlFor="request" style={{fontSize: '16px', fontWeight: '500'}}>Request Mobile Ambulance</label>
          </Box>
          <Box sx={{display:'flex', alignItems: 'center'}}>
            <input type="radio" name="request" value="Request Air Ambulance" checked={evacDet.request === 'Request Air Ambulance'} onChange={handleInputChange} />
            <label htmlFor="request" style={{fontSize: '16px', fontWeight: '500'}}>Request Air Ambulance</label>
          </Box>
        </Box>


        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '20px', margin: '20px auto'}}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgb(169, 169, 169)', borderRadius: '10px', height: 'fit-content', p: 1}}>
            <Typography >Enter number of patients to be evacuated </Typography>
            <Box sx={{my: 1, display: 'flex', justifyContent: 'center'}} >
              <input type="button" value="-" className='plus-minus' onClick={decQ} />
              <input type='number' name="evacs" value={val} onChange={(e)=>{setVal(e.target.value)}} className='inp-box inp-count' />
              <input type="button" value="+" className='plus-minus' onClick={incQ} />
            </Box>
          </Box>
          <Box sx={{width: '100%'}}>
            <input type="text" placeholder="Additional Requirements" name="additional" value={evacDet.additional} onChange={handleInputChange} className='inp-box inp-x' />
          </Box>
        </Box>


          <Box align='center' sx={{my: 3}}>
            <button className='btns' variant="contained" size="large">
                Save and Submit
            </button>
          </Box>
      </form>

        <form onSubmit={sendSupport}>
          <Box className='contact'>
            <Typography variant='h5' sx={{fontFamily: 'Poppins', fontWeight: 600, mb: 2}}>Contact Support</Typography>
            <Typography mb={2}>Use this form to send us a message or ask for support.</Typography>
            <textarea name="message" id="" cols="10" rows="10" className='inp-box text-inp' value={support.message}  onChange={handleInputChange2}  placeholder='Your message'></textarea>
            <button className='btns btns-last' variant="contained" size="large" sx={{my: 2}}>
                Ask for Support
            </button>
          </Box>
        </form>





    </Box>
  )
}
