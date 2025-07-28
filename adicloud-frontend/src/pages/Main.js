import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Main() {
  const [assets, setAssets] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch all assets or by category
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        let url = 'https://adicloud.onrender.com/assets';
        if (categoryFilter) {
          url += `?category=${categoryFilter}`;
        }

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAssets(res.data);
      } catch (err) {
        console.error('Error fetching assets:', err);
      }
    };

    fetchAssets();
  }, [categoryFilter, token]);

  return (
    <div>
      <h2>User Dashboard</h2>

      {/* Button to go to My Requests */}
      <button onClick={() => navigate('/user/requests')}>
        View My Requests
      </button>

      {/* Category filter */}
      <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
        <option value="">All Categories</option>
        <option value="Marketing">Marketing</option>
        <option value="PromoPack">PromoPack</option>
        {/* Add more categories as needed */}
      </select>

      {/* List of assets */}
      <ul>
        {assets.map((asset) => (
          <li key={asset._id}>
            <strong>{asset.name}</strong> - {asset.category}
            <ul>
              {asset.files.map((file, index) => (
                <li key={index}>
                  <a href={file} target="_blank" rel="noopener noreferrer">View File {index + 1}</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Main;
