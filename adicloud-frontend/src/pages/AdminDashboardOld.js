import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState(''); // '' = all
  const token = localStorage.getItem('token');

  // Fetch requests from backend based on status filter
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

  // Function to update request status (Approve/Reject)
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `https://adicloud.onrender.com/requests/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh the requests list after update
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
      <h2>Admin Dashboard</h2>

      {/* Status filter dropdown */}
      <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>

      {/* Requests list */}
      <ul>
        {requests.map((req) => (
          <li key={req._id}>
            <strong>User:</strong> {req.userId?.email} | 
            <strong> Asset:</strong> {req.assetId?.name} |
            <strong> Status:</strong> {req.status}
            {/* Show Approve/Reject buttons only if status is Pending */}
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
  );
}

export default AdminDashboard;
