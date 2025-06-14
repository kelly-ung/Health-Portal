/*
Apointments page for users to view and manage their appointments.
*/

import './Appointments.css';
import React, { useState, useEffect  } from 'react'; 
import Navbar from './Navbar';
import axios from 'axios';

import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; 

export default function Appointments({ role, pID, dID }) {
    const [events, setEvents] = useState([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [newEventTime, setNewEventTime] = useState('');
    const [eventStatus, setEventStatus] = useState("Pending"); 
    const [appointmentCount, setAppointmentCount] = useState(""); // State to hold appointment count
    const [isVisible, setIsVisible] = useState(false); 

    const toggleVisibility = () => {
    setIsVisible(!isVisible);  // visibility for appointment count
    };

    const handleDateClick = (arg) => {
        alert('Date clicked: ' + arg.dateStr);
    };
    const [activePopup, setActivePopup] = useState(null);
    // show or hide the popup
    const togglePopup = (AddEvent) => {
        setActivePopup(prevState => (prevState === AddEvent ? null : AddEvent)); // Toggle between showing and hiding
    };

    // Function to close the popup
    const closePopup = () => {
        setActivePopup(null);
    };

    useEffect(() => {
        if (!pID && !dID) return;

        const timer = setTimeout(() => {
            const fetchEvents = async () => {
                try {
                    const response = await axios.post('http://127.0.0.1:5000/get-appointments', {
                        role: role,
                        patient_id: pID,
                        doctor_id: dID
                    });
                    const fetchedEvents = response.data.appointments.map(event => ({
                        id: event.appointment_id,
                        start: `${event.date}T${event.time}`, 
                        color: event.status === "Confirmed" ? "#28a745" : "#ffc107",
                        title: event.reason
                    }));
                    setEvents(fetchedEvents);
                    console.log('Fetched events:', fetchedEvents);
                } catch (error) {
                    console.error('Error fetching events:', error);
                }
            };

            fetchEvents();
        }, 1);

    return () => clearTimeout(timer);
}, [pID, dID, role]); 


    // count the number of appointments per doctor
    const app_count = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/count-appointment', {
                role: 'doctor', // Only doctors can see the appointment count
            });

            if (response.data && response.data.length > 0) {
                const doctorCounts = response.data.map(doctor => ({
                    doctorName: doctor.doctor_name,
                    appointmentCount: doctor.appointment_count
                }));
                setAppointmentCount(doctorCounts);
            } else {
                setAppointmentCount([]); // Set to an empty array if no appointments are found
            }
        } catch (error) {
            console.error('Error fetching appointment count:', error);
            alert('Failed to load appointment count.');
        }
    }

    // adding a new event to the calendar
    const handleAddEvent = () => {
        if (newEventTitle && newEventDate && newEventTime) {
            // const dateTime = `${newEventDate}T${newEventTime}`; // Combine date and time
    
            // Create the new event object -for FullCalendar
            const newEvent = {
                title: newEventTitle,
                start: `${newEventDate}T${newEventTime}`,
                color: eventStatus === "Confirmed" ? "#28a745" : "#ffc107", // green if confirmed, yellow if not
            };
    
            // Send the event data to the backend
            axios.post('http://127.0.0.1:5000/add-appointment', {
                role: role,
                patient_id: pID,
                doctor_id: dID,
                newEventTitle: newEventTitle,
                newEventDate: newEventDate,
                newEventTime: newEventTime,
                eventStatus: eventStatus,
            })
            .then(response => {
                newEvent.id = response.data.appointment_id; // Use the returned appointment_id as the FullCalendar event ID
    
                // Add the new event with the real appointment_id to FullCalendar
                setEvents([...events, newEvent]);
    
                // Reset form fields
                setNewEventTitle('');
                setNewEventDate('');
                setNewEventTime('');
                setEventStatus("Pending"); // Reset the event status to Pending
            })
            .catch(error => {
                console.error('Error sending data to backend:', error);
            });
        } else {
            alert('Please fill in all fields (title, date, and time).');
        }
    };
    

    // deleting an event from the calendar
    const handleEventClick = (clickInfo) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            const appointmentId = Number(clickInfo.event.id);  // Get the event's appointment_id from FullCalendar
    
            // Send delete request to the backend
            axios.post('http://127.0.0.1:5000/delete-appointment', {
                appointment_id: appointmentId,  // Pass the correct appointment_id
            })
            .then(response => {
                console.log('Event deleted:', response.data);
                // Remove the event from FullCalendar and the frontend state
                clickInfo.event.remove();
                setEvents(events.filter(event => event.id !== appointmentId));
            })
            .catch(error => {
                console.error('Error deleting event:', error);
            });
        }
    };
    

    return (
        <div className='container'>
            <Navbar role={role} />
            <h1>Your Events</h1>
                {role === 'doctor' && (
                    <>
                        <button className="button" onClick={() => { app_count(); toggleVisibility(); }}>
                            {isVisible ? 'Hide Appointment Count' : 'View Appointment Count'}
                        </button>

                        {/* Display the appointment count -- only doctors can see */}
                        {isVisible && appointmentCount !== null && appointmentCount.length > 0 ? (
                            <div className="appointment-count">
                                <h3>Appointment Counts by Doctor:</h3>
                                <ul>{appointmentCount.map((doctor, index) => (
                                        <li key={index}>
                                            {doctor.doctorName}: {doctor.appointmentCount}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : isVisible &&(
                            <div className="appointment-count">
                                <h3>No appointments found.</h3>
                            </div>
                        )}
                        <p></p>
                    </>
                )}
                <button className='button' onClick={() => togglePopup('Add Event')}>Add Event</button>

                {activePopup === 'Add Event' && (
                    <div className="popup">
                        <div className="popup-content">
                            <button className="close-btn" onClick={closePopup}>✖</button>
                            <h3>Add a New Event</h3>
                            <div className='add-event-form'>
                                <input
                                    type="text"
                                    placeholder="Event Title"
                                    value={newEventTitle}
                                    onChange={(e) => setNewEventTitle(e.target.value)}
                                />
                                <input
                                    type="date"
                                    value={newEventDate}
                                    onChange={(e) => setNewEventDate(e.target.value)}
                                />
                                <input
                                    type="time"
                                    value={newEventTime}
                                    onChange={(e) => setNewEventTime(e.target.value)}
                                />
                                <label> Confirmed?
                                <input
                                    type="checkbox"
                                    checked={eventStatus === "Confirmed"} // Check if the status is "Confirmed"
                                    onChange={(e) => setEventStatus(e.target.checked ? "Confirmed" : "Pending")} // Update to "Confirmed" or "Pending"
                                />
                                </label>
                                <button onClick={() => { handleAddEvent(); closePopup(); }}>
                                    Add Event
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            <div className='calender-container'>
                <FullCalendar
                    plugins={[listPlugin, interactionPlugin]} 
                    initialView="listMonth" 
                    events={events} 
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    />
            </div>
        </div>
    );
}