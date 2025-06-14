/*
Health records page for doctors to view and manage their patient's health records.
This is only available to doctors and is hidden from the patient's navigation bar.
*/

import './HealthRecords.css';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HealthRecords({ role, pID, dID }) {
  const [labResults, setLabResults] = useState([]);

  // display patient's lab results
  useEffect(() => {
    if (pID !== "" && role === "patient") {
      // delay the call by 1 ms
      const timer = setTimeout(() => {
        const fetchData = () => {
          axios.post('http://127.0.0.1:5000/lab-results', {
            patient_id: pID
          })
          .then(res => {
            console.log('Response from get lab results server:', res.data);
            setLabResults(res.data.labs);
          })
          .catch(error => {
            console.error('Error sending message to lab results:', error);
          });
        };

        fetchData(); 
      }, 1);  // 1ms delay

      // cleanup timeout if the component is unmounted or if id changes
      return () => clearTimeout(timer);
    }
  }, [pID]); // run when id changes

  const exportRecord = () => {
    axios.post('http://127.0.0.1:5000/export-health-records', {
        patient_id: pID
      }, {
        responseType: 'blob' // to get binary data
      })
      .then(res => {
        console.log('Response from server:', res);
        const url = window.URL.createObjectURL(new Blob([res.data])); // creates temporary url
        const a = document.createElement('a'); // creates an <a> element to trigger download
        a.href = url;
        a.download = 'health_records.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error exporting record:', error);
      });
  };

    return (
      <div className="container">
        <Navbar role={role} />
        
        <h1>Health Records</h1>
        {role === "patient" && <button onClick={exportRecord}>Export Health Record</button>}

        <h2>Lab Results</h2>
        <table>
          <thead>
            <tr>
              <th>Test</th>
              <th>Result</th>
              <th>Date</th>
              <th>Doctor</th>
            </tr>
          </thead>
          <tbody>
            {labResults.map((lab) => (
              <tr key={lab.lab_id}>
                <td>{lab.test}</td>
                <td>{lab.result}</td>
                <td>{lab.date}</td>
                <td>{lab.doctor_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}