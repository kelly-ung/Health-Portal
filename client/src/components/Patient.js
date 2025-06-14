/*
Home Page for Patients.
*/

import './Login.css';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import './Patient.css';

export default function Patient({ role, id }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [newPhone, setNewPhone] = useState(""); // state for new phone number

    // display patient profile
    useEffect(() => {
        if (id !== "") {
          // delay the call by 1 ms
          const timer = setTimeout(() => {
            const fetchData = () => {
              axios.post('http://127.0.0.1:5000/patient-profile', {
                patient_id: id
              })
              .then(res => {
                console.log('Response from patient profile server:', res.data);
                setName(res.data.name);
                setEmail(res.data.email);
                setDob(res.data.dob);
                setGender(res.data.gender);
                setPhone(res.data.phone);
              })
              .catch(error => {
                console.error('Error sending message to patient profile:', error);
              });
            };
    
            fetchData(); 
          }, 1);  // 1ms delay
    
          // cleanup timeout if the component is unmounted or if id changes
          return () => clearTimeout(timer);
        }
    }, [id]); // run when id changes

    const [activePopup, setActivePopup] = useState(null);
    // show or hide the popup
    const togglePopup = (updatePhoneNum) => {
        setActivePopup(prevState => (prevState === updatePhoneNum ? null : updatePhoneNum)); // Toggle between showing and hiding
    };

    const closePopup = () => {
        setActivePopup(null);
    };

        
    const handleUpdateNum = () => {
      const updatePhone = () => {
      // TODO: Add logic to update the phone number in the backend
      fetch('http://127.0.0.1:5000/update-patient-phone',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_id: id,
          phone: newPhone
        })
    })
    .then(res => res.json())
    .then(data =>{
      console.log('Phone update:', data);
      setPhone(newPhone);
      setNewPhone("");
    })
    .catch(error => {
      console.error('Error updating phone number:', error);
    })
  };
  updatePhone();
};

    return (
      <div className="container">
          <Navbar role={role} />
          <div className="patient-dashboard">
              <h1>Patient Dashboard</h1>
              <h2>Hi, {name}</h2>
              <div className="profile-card">
                  <p><strong>Patient ID:</strong> {id}</p>
                  <p><strong>Email:</strong> {email}</p>
                  <p><strong>Date of Birth:</strong> {new Date(dob).toLocaleDateString()}</p>
                  <p><strong>Gender:</strong> {gender}</p>
                  <p><strong>Phone:</strong> {phone} 
                    <button className="phone-update-button" onClick={() => togglePopup('Update Phone Number')}>Update</button></p>
                    {activePopup === 'Update Phone Number' && (
                      <div className="popup">
                          <div className="popup-content">
                          <button className="close-btn" onClick={closePopup}>✖</button>
                              <h3>Update Phone Number</h3>
                              <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Enter new phone number" />
                              <button className="phone-update-button" onClick={() => {handleUpdateNum(); closePopup()}}>Submit</button>
                          </div>
                      </div>
                    )}
              </div>
          </div>
      </div>
  )
  
}

