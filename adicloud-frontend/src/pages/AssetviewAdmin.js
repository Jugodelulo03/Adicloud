import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './assetsview.css';
import Logo from './assets/logo_tradicional.svg';
import Header from './components/Header';
import Footer from './components/footer';

const getFileName = (url) => {
  return url.split('/').pop();
};

function AdminRequestForm() {
  const { idAsset } = useParams();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const { status } = useParams();
  const [asset, setAsset] = useState(null);
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


  if (!asset) return<div className='menu1'>
    <img src={Logo} alt="Logo" className="fade-in-logo" />
  </div>

  return (
    <div className="wrapper">
      <Header statusFilter={statusFilter} setStatusFilter={setStatusFilter} role={"admin"}/>
      <div className='body'>
        <div className='bodyl'>
          {/* Show all images */}
          <div>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminRequestForm;