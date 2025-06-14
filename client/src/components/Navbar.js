/*
Navbar component for the Health Portal application.
The navigation bar will display once patient or doctor logs in.
*/

import './Navbar.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from './images/health-icon.png'; 

export default function Navbar({ role }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleNav = () => {
        setIsOpen(!isOpen); 
    };

    const closeNav = () => {
        setIsOpen(false);
    };

    const handleSignOut = () => {
        navigate('/');
    }

    return (
        <>
            <div className="hamburger" onClick={toggleNav}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <nav className={`nav ${isOpen ? 'open' : ''}`}>
                <div className='header'>
                    <img src={logo} className="logo" alt="Logo" />
                    <div className="nav-title">Health Portal</div>
                </div>
                <ul>
                    <li>
                        <Link 
                            to={role === 'patient' ? '/Patient' : role === 'doctor' ? '/Doctor' : '/Doctor'} 
                            onClick={closeNav}>Home</Link>
                    </li>
                    <li>
                        <Link to='/Messages' onClick={closeNav}>Messages</Link>
                    </li>
                    <li>
                        <Link to='/Appointments' onClick={closeNav}>Appointments</Link>
                    </li>
                    {/* Render health records only if the role is 'patient' */}
                    {role === 'patient' &&
                    <li>
                        <Link to='/HealthRecords' onClick={closeNav}>Health Records</Link>
                    </li>
                    }
                    <button onClick={handleSignOut}>Sign Out</button>
                </ul>
            </nav>
        </>
    );
}
