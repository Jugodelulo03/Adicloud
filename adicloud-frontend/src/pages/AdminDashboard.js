import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import RequestCard from './components/RequestCard';
import Header from './components/Header';
import './Admindash.css';
import { useParams } from 'react-router-dom';

function AdminDashboard() {
  const { status } = useParams();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState(status || '');
  const token = localStorage.getItem('token');

  useEffect(() => {
    setStatusFilter(status || 'All');
  }, [status]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let url = 'https://adicloud.onrender.com/requests';
        if (statusFilter) {
          url = `https://adicloud.onrender.com/requests/status/${statusFilter}`;
        }

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };

    fetchRequests();
  }, [statusFilter, token]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `https://adicloud.onrender.com/requests/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(prev =>
        prev.map(req =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div>
      <Header statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      <div className='body'>
        <h1>View {status || "All"}</h1>
        <h2>REQUESTS</h2>
        <div>
          <ul className='ConteinerMain'>
            {requests.map((req) => (
              <RequestCard 
                key={req._id}
                request={req}
                onApprove={()=> updateStatus(req.id, "Approved")}
                onReject={() => updateStatus(req._id, 'Rejected')}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;