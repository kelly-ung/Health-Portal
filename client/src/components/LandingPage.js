/*
Users will see this landing page upon entering the website.
It allows users to select their role (doctor or patient) and navigate to the appropriate login page.
*/

import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ setRole }) {
    const navigate = useNavigate();

    // user selects a role (doctor or patient) 
    const handleRole = (role) => {
        setRole(role); // Set the role
        if (role === "doctor") {
            navigate('/DoctorLogin'); // redirect to Doctor Login page
        }
        else if (role === "patient") {
            navigate('/PatientLogin'); // redirect to Patient Login page
        }
    }

    return (
        <div>
            <h1 className="landing-page-title">Health Portal</h1>
            <h3>Choose an Account</h3>
            <div className="role-container">
                <button className="role-button" onClick={() => handleRole("doctor")}>Doctor</button>
                <button className="role-button" onClick={() => handleRole("patient")}>Patient</button>
            </div>
        </div>
    )
}
