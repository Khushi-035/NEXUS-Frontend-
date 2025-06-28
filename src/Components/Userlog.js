import React
// ,{ useState, useEffect, useMemo } 
from 'react';
// import axios from 'axios';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
// import { user_log } from './Data/user_log';
// import CloseIcon from '@mui/icons-material/Close';
// import { Link } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
// import { useSelector } from 'react-redux';
// import { selectUser } from './Features/UserAuth/UserSlice';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Userlog(props) {
  const { 
    // data2, 
    data } = props;
  // const [inpVal, setInpVal] = useState('');
  // const emp = useSelector(selectEmp);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const user = useSelector(selectUser);

  // Fetch employee details from API
  


  // const redirectTo = (e) => {
  //   dispatch(setEmpName({
  //     emp: e.target.textContent
  //   }));
  //   navigate('/EmployeeDetails');
  // }

  // const calculateHealthCondition = (emp_name) => {
  //   const empDetails = data2 ? data2.find(d => d.uid === emp_name) : {};
  //   if (!empDetails) return { score: 0, condition: 'Unknown' };

  //   const { heartRate: hr, spo2, bodyTemperature: temp, respiratoryRate: rr } = empDetails;

  //   let hr_score = hr >= 51 && hr <= 90 ? 3 : (hr >= 40 && hr <= 50) || (hr >= 91 && hr <= 110) ? 2 : 1;
  //   let spo2_score = spo2 >= 96 && spo2 <= 100 ? 2 : spo2 >= 91 && spo2 <= 95 ? 1 : 0;
  //   let temp_score = temp >= 36.1 && temp <= 38.0 ? 1 : 0;
  //   let rr_score = rr >= 8 && rr <= 16 ? 2 : 1;

  //   let Modified_NEWS = (rr_score * 0.2) + (spo2_score * 0.2) + (temp_score * 0.15) + (hr_score * 0.3);
  //   let TOTAL_HEALTH_SCORE = (Modified_NEWS / 2.15) * 100;

  //   let condition;
  //   if (TOTAL_HEALTH_SCORE >= 70 && TOTAL_HEALTH_SCORE <= 100) {
  //     condition = 'Stable';
  //   } else if (TOTAL_HEALTH_SCORE > 40 && TOTAL_HEALTH_SCORE < 70) {
  //     condition = 'Dangerous';
  //   } else {
  //     condition = 'Critical';
  //   }

  //   return { score: Math.round(TOTAL_HEALTH_SCORE), condition };
  // };

  // const filteredData = useMemo(() => data2?.filter((row) => {
  //   if (inpVal === '' && row.uid !== '') {
  //     return true;
  //   }
  //   return row.deviceId.toLowerCase().includes(inpVal.toLowerCase()) && row.uid !== '';
  // }), [data2, inpVal]);

  return (
    <Box sx={{ p: 2 }}>
      <DrawerHeader />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
        <Typography variant='h4' sx={{ fontFamily: 'Poppins', fontWeight: 600, my: 2 }}>User Activity Log</Typography>
        {/* <Box sx={{ width: '100%', display: 'flex' }}>
          <input
            type="text"
            placeholder="Search by Device ID..."
            value={inpVal}
            onChange={(e) => setInpVal(e.target.value)}
            className='inp-box inp-srch'
          />
          {inpVal &&
            <button className='btns cross' variant="contained" onClick={() => setInpVal('')}><CloseIcon /></button>
          }
        </Box> */}
      </Box>

      <div className="outer-wrapper-2">
        <div className="table-wrapper-3">
          <table>
            <thead>
              <tr>
                <th align="right"><b>Action</b></th>
                <th align="right"><b>Action done by</b></th>
                <th align="right"><b>DATE</b></th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? data?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((row, i) => {
                const options = { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit' 
                };
                // const formattedDate = new Date(row.updatedAt).toLocaleString();
                const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(row.updatedAt));
                return (
                  <tr key={i}>
                    <td><strong>{row.message}</strong></td>
                    <td>{row.id}</td>
                    <td>{formattedDate}</td>
                  </tr>
                );
              }) : <tr><td colSpan="3" style={{textAlign: 'center'}}>Data loading...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </Box>
  )
}
