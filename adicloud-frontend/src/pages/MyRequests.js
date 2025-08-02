import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequestCard from './components/RequestCard';
import Header from './components/Header';
import Footer from './components/footer';
import { useParams } from 'react-router-dom';

function MyRequests() {
  const { status } = useParams();
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let url = `https://adicloud.onrender.com/requests/user/${userId}`;
        if (status) {
          url += `/${status}`;
        }        
        const res = await axios.get(url, {
          headers: { authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching requests:', err);
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
      }
    };

    if (userId) fetchRequests();
  }, [token, userId, status]);

  const handleDownload = async (assetId, assetName) => {
  try {
    const response = await axios.get(`https://adicloud.onrender.com/assets/download/${assetId}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${assetName}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error downloading file:', err);
    alert('Error downloading the file');
  }
};

  return (
    <div>
      <Header statusFilter={status} setStatusFilter={() => {}} role="user" />
      <div className='body'>
        <div>
            <h2>{status || "All"} Requests</h2>
            <ul className='ConteinerMain'>
              {requests.map((req) => (
                <RequestCard 
                  key={req._id}
                  request={req}
                  onDownload={() => handleDownload(req.assetId._id, req.assetId.name)}
                />
              ))}
            </ul>
          </div>
      </div>
    <Footer />  
    </div>
  );
}

export default MyRequests;

