import React from 'react';
// import { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { 
    // Link, 
    useNavigate } from 'react-router-dom';
// import PestControlIcon from '@mui/icons-material/PestControl'; 
import { selectUser } from './Features/UserAuth/UserSlice';
import { useSelector } from 'react-redux';


export default function NotFound() {

    const user = useSelector(selectUser);

    const navigate = useNavigate();


    if (user) {
        navigate('/');
    }
    else {
        navigate('/login');
    }


    return (
        <div>
        </div>
    )
}
