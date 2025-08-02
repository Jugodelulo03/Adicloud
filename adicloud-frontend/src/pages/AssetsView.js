import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './assetsview.css';
import Logo from './assets/logo_tradicional.svg';
import Header from './components/Header';

const getFileName = (url) => {
  return url.split('/').pop();
};

function UserRequestForm() {
  const { idAsset } = useParams();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const { status } = useParams();
  const [asset, setAsset] = useState(null);
  const [purpose, setPurpose] = useState('');
  const [deadline, setDeadline] = useState('');
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState(status || '');



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
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
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
    <div>
      <Header statusFilter={statusFilter} setStatusFilter={setStatusFilter} role={"user"}/>
      <div className='body'>
        <div className='bodyl'>
          {/* Show all images */}
          <div className='AssetsFilesView'>
            {asset.files.map((url, idx) => (
            <div
                key={idx}
                className="AssetWrapper"
                onMouseMove={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  img.style.transformOrigin = `${x}% ${y}%`;
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  img.style.transform = 'scale(1)';
                }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  img.style.transform = 'scale(1.6)';
                }}
              >
                <img src={url} alt={`Asset ${idx}`} className="AssetPrev" />
              </div>
            ))}
          </div>
        

          <div className='RightPanel'>
            <h2 className='TransformTitle'>{asset.name}</h2>
            <div className='InfoAssets'>
              <p>{asset.category} category</p>
              <p>{asset.files.length} files</p>
              <div>
                <ul className="FilesList">
                  {asset.files.map((url, idx) => (
                    <li key={idx} className="FileItem">
                      <img src={url} alt={`thumb-${idx}`} className="FileThumb" />
                      <p>{getFileName(url)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <h3 className='ToRquest'>To Request</h3>
            <p className='before'>Before submit, please fill in all the information.</p>

            <form onSubmit={handleSubmit}  className='styleForm'>
              <input
                type="text"
                placeholder="Purpose*"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                className='textbox'
              />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className='datebox'
              />
              <p className='after'>All fields market with * are requeried.</p>
              <button type="submit" className='botton1'>Submit</button>
            </form>
          </div>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default UserRequestForm;
