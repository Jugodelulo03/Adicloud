import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
        const res = await axios.get(`https://adicloud.onrender.com/assets?id=${idAsset}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // The backend returns an array, so we pick the first
        if (res.data.length > 0) {
          setAsset(res.data[0]);
        }
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
      setTimeout(() => navigate('/user'), 2000); // return to main after 2s
    } catch (err) {
      console.error('Error creating request:', err);
      setMessage('Failed to submit request');
    }
  };

  if (!asset) return <p>Loading asset...</p>;

  return (
    <div>
      <h2>Request Asset: {asset.name}</h2>
      <p><strong>Category:</strong> {asset.category}</p>
      <p><strong>Number of files:</strong> {asset.files.length}</p>

      {/* Show all images */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {asset.files.map((url, idx) => (
          <img key={idx} src={url} alt={`Asset ${idx}`} style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
        ))}
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

      {message && <p>{message}</p>}
    </div>
  );
}

export default UserRequestForm;
