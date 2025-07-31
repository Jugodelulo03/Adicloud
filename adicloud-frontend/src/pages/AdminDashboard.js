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
        <h2>Requests</h2>
        <ul>
          {requests.map((req) => (
            <li key={req._id}>
              <img
                src={req.assetId?.files[0]}
                alt={req.assetId?.name}
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
              {req.assetId?.name} |
              {req.assetId?.files?.length} files |
              <strong> To:</strong> {req.userId?.name} |
              <strong> Purpose:</strong> {req.purpose}|
              <strong> Requested:</strong> {req.createdAt}|
              <strong> Deadline:</strong> {req.deadline}|
              <strong> Status:</strong> {req.status}|
              {req.status === 'Pending' && (
                <>
                  <button onClick={() => updateStatus(req._id, 'Approved')}>Approve</button>
                  <button onClick={() => updateStatus(req._id, 'Rejected')}>Reject</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;