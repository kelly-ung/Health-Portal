/*
Page for doctors to either sign in or create an account.
*/


import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function DoctorLogin({ setId }) {
    const navigate = useNavigate();
    const [signUp, setSignUp] = useState(false);
    const [signIn, setSignIn] = useState(false);
    const [doctorId, setDoctorId] = useState("");
    const [name, setName] = useState("");
    const [signInError, setSignInError] = useState(false);


    // saves user's choice when they click sign up or sign in
    const handleChoice = (input) => {
        if (input === "sign up") {
            setSignUp(true);
        } else if (input === "sign in") {
            setSignIn(true);
        }
    }


    // handle sign in
    const handleSignIn = (e) => {
        e.preventDefault();  


        let result = ""
        axios.post('http://127.0.0.1:5000/doctor-sign-in', {
            doctor_id: doctorId
        })
        .then(res => {
            console.log('Response from doctor sign in server:', res.data);
           
            result = res.data.result;
            if (result === "success") {
                setId(res.data.doctor_id)
                navigate('/Doctor'); // redirect to Doctor page after sign in
            }
            else if (result === "error") {
                setSignInError(true);
                console.log(signInError)
            }
        })
        .catch(error => {
            console.error('Error sending message to doctor sign in:', error);
        });
    }


    // handle sign up
    const handleSignUp = (e) => {
        e.preventDefault();  


        axios.post('http://127.0.0.1:5000/doctor-sign-up', {
            name: name
        })
        .then(res => {
            console.log('Response from doctor sign up server', res.data);
            setId(res.data.doctor_id)
            navigate('/Doctor'); // redirect to Doctor page after sign up
        })
        .catch(error => {
            console.error('Error sending message to doctor sign up:', error)
        });
    }


    return (
        <div>
            <h1>Doctor</h1>


            {/* display both sign in and sign up options */}
            {!signIn && !signUp ? (
                <div className="account-container">
                    <button className="account-button" onClick={() => handleChoice("sign in")}>Sign In</button>
                    <button className="account-button" onClick={() => handleChoice("sign up")}>Create An Account</button>
                </div>
            ): null}
       
            {/* display sign in form if user selects sign in */}
            {signIn ? (
                <div>
                    <form className="login-form">
                        <div className="login-form-item">
                            <label>Enter Doctor ID:</label>
                            <input type="number" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}/>
                        </div>
                        <button onClick={(e) => handleSignIn(e)} type="submit">Sign In</button>
                    </form>
                    {signInError && (<p>Invalid Doctor ID.</p>)}
                    <button className='back-button' onClick={() => setSignIn(false)}>Back</button>
                </div>
            ) : null}
           
            {/* display sign up form if user selects sign up */}
            {signUp ? (
                <div>
                    <form className="login-form">
                        <div className="login-form-item">
                            <label>Name:</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <button onClick={(e) => handleSignUp(e)} type="submit">Sign Up</button>
                    </form>
                    <button className='back-button' onClick={() => setSignUp(false)}>Back</button>
                </div>
            ) : null}
        </div>
    )
}