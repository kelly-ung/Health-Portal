/*
Home Page for Doctors.
*/

import './Doctor.css';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

export default function Doctor({ role, id }) {
    const [name, setName] = useState("")

    // display doctor profile
    useEffect(() => {
        if (id !== "") {
          // delay the call by 1 ms
          const timer = setTimeout(() => {
            const fetchData = () => {
              axios.post('http://127.0.0.1:5000/doctor-profile', {
                doctor_id: id
              })
              .then(res => {
                console.log('Response from doctor profile server:', res.data);
                setName(res.data.name);
              })
              .catch(error => {
                console.error('Error sending message to doctor profile:', error);
              });
            };
    
            fetchData(); 
          }, 1);  // 1ms delay
    
          // cleanup timeout if the component is unmounted or if id changes
          return () => clearTimeout(timer);
        }
    }, [id]); // run when id changes


    return (
        <div className='container'>
            <Navbar role={role} />
            <h1>Doctor Dashboard</h1>
            <h2>Hi, {name}</h2>
            <div className="profile-card">
              <p><strong>Doctor ID: </strong>{id}</p>
            </div>
        </div>
    )
}

