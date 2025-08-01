import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import { useParams } from 'react-router-dom';

function MyRequests() {
  const { status } = useParams();
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let url = `https://adicloud.onrender.com/requests/user/${userId}/${status}`;
        const res = await axios.get(url, {
          headers: { authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };

    if (userId && status) fetchRequests();
  }, [token, userId, status]);

  return (
    <div>
      <Header statusFilter={status} setStatusFilter={() => {}} role="user" />
      <h2>{status} Requests</h2>
      <ul>
        {requests.map(req => (
          <li key={req._id}>
            {req.assetId?.name} - {req.purpose} (Deadline: {req.deadline})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyRequests;

