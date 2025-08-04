import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import RequestCard from './components/RequestCard';
import Header from './components/Header';
import Footer from './components/footer';
import './Admindash.css';
import { useParams } from 'react-router-dom';


function AdminDashboard() {
  const { status } = useParams();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState(status || '');
  const token = localStorage.getItem('token');

  // Sync the status filter with the URL param when it changes
  useEffect(() => {
    setStatusFilter(status || 'All');
  }, [status]);

  // Fetch requests from backend whenever statusFilter changes
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

        setRequests(res.data); // Update state with fetched requests
      } catch (err) {
        console.error('Error fetching requests:', err);
        // If an error occurs (e.g., invalid token), clear session and redirect
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
      }
    };

    fetchRequests();
  }, [statusFilter, token]);

  // Updates the status of a specific request
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `https://adicloud.onrender.com/requests/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Optimistically update local state without refetching
      setRequests(prev =>
        prev.map(req =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/';
    }
  };

  return (
    <div className="wrapper">
      
      <Header statusFilter={statusFilter} setStatusFilter={setStatusFilter} role={"admin"}/>
      <div className='body'>
        <h1>View {status || "All"}</h1>
        <h2>REQUESTS</h2>
        <div>
          <ul className='ConteinerMain'>
            {requests.map((req) => (
              <RequestCard 
                key={req._id}
                request={req}
                onApprove={()=> updateStatus(req._id, "Approved")}
                onReject={() => updateStatus(req._id, 'Rejected')}
              />
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;