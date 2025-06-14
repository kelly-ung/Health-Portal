/*
Messages page for doctors and patients to send and receive messages.
*/

import './Messages.css';
import React, { useState, useRef, useEffect } from 'react'; 
import Navbar from './Navbar';
import axios from 'axios';

function Messages({ role, pID, dID }) {
  const [userMessage, setUserMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [unavailable, setUnavailable] = useState(false);
  const messagesEndRef = useRef(null)
  let id = null;

  // assign id to the id of the current user role
  if (role === "patient") {
    id = pID
  } else if (role === "doctor") {
    id = dID
  }

  // display messages based on patient or doctor
  useEffect(() => {
    if ((pID !== "" && role === "patient") || (dID !== "" && role === "doctor")) {
      // delay the call by 1 ms
      const timer = setTimeout(() => {
        const fetchData = () => {
          axios.post('http://127.0.0.1:5000/get-messages', {
            role: role,
            id: id
          })
          .then(res => {
            console.log('Response from get messages server:', res.data);
            setMessages(res.data);
          })
          .catch(error => {
            console.error('Error sending message to get messages:', error);
          });
        };

        fetchData(); 
      }, 1);  // 1ms delay

      // cleanup timeout if the component is unmounted or if id changes
      return () => clearTimeout(timer);
    }
  }, [pID, dID]); // run when id changes

  // send message to the server and add to existing messages
  const handleSendMessage = () =>  {
    if (!userMessage.trim()) return // don't send empty messages
    setLoading(true) 

    let endpoint = ""

    if (role === "patient") {
      endpoint = "http://127.0.0.1:5000/send-patient-message"
    } 
    else if (role === "doctor") {
      endpoint = "http://127.0.0.1:5000/send-doctor-message"
    }

    axios.post(endpoint, {
      id: id,
      message_body: userMessage
    })
    .then(res => {
      console.log('Response from get send patient message server:', res.data);
      setUserMessage("");
      setLoading(false);

      if (res.data.result === true) {
        setMessages(prevMessages => [...prevMessages, res.data]); // add new message to messages
      }
      else if (res.data.result === false) {
        setUnavailable(true); // indicate that message cannot be sent
      }
    })
    .catch(error => {
      console.error('Error sending message to send patient message:', error);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="container">
    <Navbar role={role} />
      <h1>Messages</h1>
      <div className="chat-box">
        <div className="messages">
          {messages.length === 0 && !unavailable && <div className="empty-state">Start a chat...</div>}
          {unavailable && (
            <p>Sorry, there are currently no {role === "patient" ? "doctor" : "patient"}s to message. The system will match you with a {role === "patient" ? "doctor" : "patient"} once one is available.</p>
          )}
          {messages.map((msg) => (
            <div key={msg.message_id} className={`message ${msg.sender_id === id ? "user" : "sender"}`}>
              <strong>{msg.sender_id === id ? msg.sender_name : msg.receiver_name} :</strong> {msg.message_body}
            </div>
          ))}
          {loading && <div className="loading">✨Awaiting Response</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <textarea className="input-texts"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={2}
            disabled={loading}
          />
          <button className="send-button" onClick={handleSendMessage} disabled={loading}>
            {loading ? "..." :"Send"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Messages