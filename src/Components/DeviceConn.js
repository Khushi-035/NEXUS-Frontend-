import React from 'react';
import { Typography } from '@mui/material';

export default function DeviceConn(props) {

    return (
        <>
                {props.message && 
                <div
                    className='popup4'
                    // key={index}
                    style={{ right: '83%', top: `2%`, zIndex: 2000 }}
                >
                    <Typography variant='h6'>{props.message}</Typography>
                </div>
                }
        </>
    );
}
