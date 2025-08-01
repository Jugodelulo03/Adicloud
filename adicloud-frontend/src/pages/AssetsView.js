import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './assetsview.css';
import Logo from './assets/logo_tradicional.svg';

function UserRequestForm() {
  const { idAsset } = useParams();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [purpose, setPurpose] = useState('');
  const [deadline, setDeadline] = useState('');
  const [message, setMessage] = useState('');

  // Fetch asset details
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await axios.get(`https://adicloud.onrender.com/assets/${idAsset}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAsset(res.data);
      } catch (err) {
        console.error('Error fetching asset:', err);
      }
    };

    fetchAsset();
  }, [idAsset, token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://adicloud.onrender.com/requests', {
        userId,
        assetId: idAsset,
        purpose,
        deadline
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Request submitted successfully!');
      setTimeout(() => navigate('/galery'), 2000); // return to main after 2s
    } catch (err) {
      console.error('Error creating request:', err);
      setMessage('Failed to submit request');
    }
  };

  if (!asset) return<div className='menu1'>
    <img src={Logo} alt="Logo" className="fade-in-logo" />
  </div>

  return (
    <div className='body'>
      {/* Show all images */}
      <div className='AssetsFilesView'>
        {asset.files.map((url, idx) => (
          <img key={idx} src={url} alt={`Asset ${idx}`} className='AssetPrev' />
        ))}
      </div>

      <div className='RightPanel'>
        <h2 className='TransformTitle'>{asset.name}</h2>
        <div className='InfoAssets'>
          <p><strong>Category:</strong> {asset.category}</p>
          <p><strong>Number of files:</strong> {asset.files.length}</p>
        </div>


        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
          <br />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
          <br />
          <button type="submit">Submit Request</button>
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UserRequestForm;
