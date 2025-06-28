import React
// , { useEffect } 
from 'react';
import ReactLoading from 'react-loading';

import IOCLlogo from './Images/logo.png'
import LVLlogo from './Images/logo.png';

import { 
  // Link, 
  useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useParams } from 'react-router-dom';
import Select from 'react-select';

import { useDispatch } from 'react-redux';
import { login } from './Features/UserAuth/UserSlice';

import axios from 'axios';

export default function Login () {

  const dispatch = useDispatch();
  
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState('');
  const [errMsg, setErrMsg] = useState('Incorrect Credentials');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const rolefunc = (opts) => {
      // setRole(opts);
      setRole(opts);
      // let x = Object.values(opts);
      // formData.medicname = [...x];
    }
// console.log(role.value);
  const optrole = [
      {value: 'admin', label: 'Admin'},
      {value: 'medic', label: 'Medic'},
      {value: 'doctor', label: 'Doctor'},
    ] 
  
  const notifyerror = () => {toast.error(errMsg, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });}

  const submit = async (e) =>{
    e.preventDefault();
    try{
      // if (role.value === role) {
        console.log('1st lvl clear');
        setLoading(true);
        const res = await axios.post('https://cms-backend-five.vercel.app/api/auth/login', 
          {
            username: name, 
            password: pass, 
            role: role.value
          },
          { headers: 
            { 
              'Content-Type': 'application/json' 
            } 
          }
        )
        console.log("login done");
        setLoading(false);
        dispatch(login({ 
          username: name, 
          role: role.value, 
          accessToken: res.data.token, 
          loggedIn: true
        }));
        axios.post('https://cms-backend-five.vercel.app/api/log/createLogs', {
            id: name,
            message: role?.value + ' Logged in with ID: '+ name,
        }, {
            headers: {
                'Content-Type': 'application/json',
                // "Authorization": `Bearer ${user?.accessToken}`
        }}).then((res) => {
            console.log('Notification sent');
        }).catch((error) => {
            console.log('Error:', error);
        });
        navigate('/');
      // }
      // else{
      //   notifyerror();
      // }

    }
    catch(err){
      setLoading(false);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Invalid Credentials');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Invalid Credentials');
      }
      notifyerror();
    }
  }


  return (
      <div style={{backgroundColor: '#dddddd', height: '100vh'}}>
        <ToastContainer />
        <div style={{display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '15px'}}>
            <img src={LVLlogo} alt='cms' width='120px' />
        </div>
        <div style={{width: '65%', height: 'fit-content', border: '2px solid black', borderRadius: '30px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', margin: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white'}}>
            <div style={{borderRight: '2px solid black', padding: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'center', width: '100%', height: '230px', marginTop: '70px' }}>
                    <img src={IOCLlogo} alt="logo" width='100%' height='100%' />
                </div>
            </div>
            <div style={{backgroundColor: 'white', width: '90%', margin: '0px auto'}}>
              <h1 style={{margin: '20px 0', fontWeight: 800, textAlign: 'center'}}>Login</h1>
                    <form onSubmit={submit}>
                        <div style={{width: '100%', marginTop: '10px'}}>
                            <p style={{margin: '5px 0', fontWeight: 600}}>Username : </p>
                            <input 
                                type="text"
                                name='username'
                                autoComplete='false'
                                placeholder="Enter your User Name"
                                value={name} 
                                onChange={(e)=>{setName(e.target.value)}} 
                                style={{border: '1px solid lightgrey', outline: '#338cff', width: '100%', padding: '15px', boxSizing: 'border-box', borderRadius: '5px', fontSize: '13px'}}
                                required
                            />
                        </div>

                        <div style={{width: '100%', marginTop: '20px'}}>
                            <p style={{margin: '5px 0', fontWeight: 600}}>Password : </p>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Enter your password" 
                                value={pass} 
                                onChange={(e)=>{setPass(e.target.value)}} 
                                style={{border: '1px solid lightgrey', outline: '#338cff', width: '100%', padding: '15px', boxSizing: 'border-box', borderRadius: '5px', fontSize: '13px'}}
                                required
                            />
                        </div>

                        <div style={{width: '100%', marginTop: '20px'}}>
                            <p style={{margin: '5px 0', fontWeight: 600}}>Role : </p>
                            <div className="roles">
                                <Select
                                    // defaultValue={opt}
                                    name="roles"
                                    options={optrole}
                                    onChange={rolefunc}
                                    value={role}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Choose your role..."
                                    required
                                />
                            </div>
                        </div>

                        <button style={{backgroundColor: '#4070f4', border: 'none', color: 'white', width: '50%', display: 'inline-block', textAlign: 'center', margin: '10px auto', padding: '12px', borderRadius: '6px', marginTop: '20px', marginBottom: '10px'}}>
                            {loading ? <div style={{display: 'flex', justifyContent: 'center'}}><ReactLoading type="bubbles" color="#fff" height={20} width={25} /></div> : 'Login'}
                        </button>
                    </form>

            </div>
        </div>
        </div>
  )
}

// -----------------------------------

// Login.js


// 1.
// import { createContext } from react;
// const noteContext = createContext();

// export default noteContext;
// ---------------------
// 2. 
// import React from react;
// import noteContext from

// const NoteState = (props) => {
// const [menu, setMenu] = useState(false);
// return (
// <noteContext.provider value={menu}>
// {props.children}
// </noteContext.provider>
// )}
// export default NoteState;
// ----------------------
// 3.
// outside <Router> use <NoteState>
// ----------------------
// 4.
// import noteContext from

// a = useContext(noteContext)

// {a.menu &&
// }