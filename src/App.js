import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Nav from './Components/Nav';
import Login from './Components/Login';


import { selectUser } from './Components/Features/UserAuth/UserSlice';
import { useSelector } from 'react-redux';


function App() {


  const user = useSelector(selectUser);


  return (
    <Router>
      {user?.loggedIn ? 
      <>
        <Nav />
      </>
      : 
        <>
          <Login />
          <Routes>
            <Route path="/*" element={<Navigate to='/login' replace />}></Route>
          </Routes>
        </>
      }
    </Router>
  );
}

export default App;

// dark - #202123
// black - #343541
// mid dark - #444654
// red - #ff4b4b
// blue - 


// body - 
//black == background-color: #262730;
//   color: white;
// nav - 
//dark grey == background-color: #343541;
//   color: white;
// nav .sidebar - 
// background-color: #343541;
//   color: white;

