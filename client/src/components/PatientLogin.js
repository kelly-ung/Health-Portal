/*
Page for patients to either sign in or create an account.
*/

import './Login.css';
import { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PatientLogin({ setId }) {
    const navigate = useNavigate();
    const [signUp, setSignUp] = useState(false);
    const [signIn, setSignIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [signInError, setSignInError] = useState(false);
    const [signUpError, setSignUpError] = useState(false);

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
        axios.post('http://127.0.0.1:5000/patient-sign-in', {
            email: email,
            password: password
        })
        .then(res => {
            console.log('Response from patient sign in server:', res.data);
            
            result = res.data.result;
            if (result === "success") {
                navigate('/Patient'); // redirect to Patient page after sign in
                setId(res.data.patient_id)
            } 
            else if (result === "error") {
                setSignInError(true);
            }
        })
        .catch(error => {
            console.error('Error sending message to patient sign in:', error);
        });
    }

    // handle sign up
    const handleSignUp = (e) => {
        e.preventDefault();

        axios.post('http://127.0.0.1:5000/patient-sign-up', {
            email: email,
            password: password,
            name: name,
            dob: dob,
            gender: gender,
            phone: phone

        })
        .then(res => {
            console.log('Response from patient sign up server', res.data);
            if (res.data.patient_id === -1) {
                setSignUpError(true);
            }
            else {
                setId(res.data.patient_id)
                navigate('/Patient'); // redirect to Patient page after sign up
            }
        })
        .catch(error => {
            console.error('Error sending message to patient sign up:', error)
        });
    }

    return (
        <div>
            <h1>Patient</h1>

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
                            <label>Email:</label>
                            <input 
                                type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="login-form-item">
                            <label>Password:</label>
                            <input 
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <button onClick={(e) => handleSignIn(e)} type="submit">Sign In</button>
                    </form>
                    {signInError && (<p>Invalid email or password.</p>)}
                    <button className='back-button' onClick={() => setSignIn(false)}>Back</button>
                </div>
            ) : null}

            {/* display sign up form if user selects sign up */}
            {signUp ? (
                <div> 
                    <form className="login-form">
                        <div className="login-form-item">
                            <label>Name:</label>
                            <input 
                                type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="login-form-item">
                            <label>Email:</label>
                            <input 
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="login-form-item">
                            <label>Password:</label>
                            <input 
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="login-form-item">
                            <label>Date of Birth:</label>
                            <input 
                                type="date" value={dob} onChange={(e) => setDob(e.target.value)}/>
                        </div>
                        <div className="login-form-item">
                            <label>Gender:</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option></option>
                                <option>M</option>
                                <option>F</option>
                            </select>
                        </div>
                        <div className="login-form-item">
                            <label>Phone:</label>
                            <input 
                                placeholder="123-456-7890" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                        </div>
                        <button onClick={(e) => handleSignUp(e)} type="submit">Sign Up</button>
                    </form>
                    {signUpError && (<p>Invalid. An account with this email already exists.</p>)}
                    <button className='back-button' onClick={() => setSignUp(false)}>Back</button>
                </div>
            ) : null}
        </div>
    )
}