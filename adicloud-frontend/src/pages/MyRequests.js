import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';


function MyRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); // Ensure userId is stored at login

  // Fetch all user requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`https://adicloud.onrender.com/requests/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };

    fetchRequests();
  }, [token, userId]);

  // Helper to group requests by status
  const groupByStatus = (status) => requests.filter(req => req.status === status);

  return (
    <div>
      <h2>My Requests</h2>

      {/* Pending Requests */}
      <h3>Pending</h3>
      <ul>
        {groupByStatus('Pending').map(req => (
          <li key={req._id}>
            {req.assetId?.name} - {req.purpose} (Deadline: {req.deadline})
          </li>
        ))}
      </ul>

      {/* Approved Requests */}
      <h3>Approved</h3>
      <ul>
        {groupByStatus('Approved').map(req => (
          <li key={req._id}>
            {req.assetId?.name} - {req.purpose} (Deadline: {req.deadline})
          </li>
        ))}
      </ul>

      {/* Rejected Requests */}
      <h3>Rejected</h3>
      <ul>
        {groupByStatus('Rejected').map(req => (
          <li key={req._id}>
            {req.assetId?.name} - {req.purpose} (Deadline: {req.deadline})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyRequests;
