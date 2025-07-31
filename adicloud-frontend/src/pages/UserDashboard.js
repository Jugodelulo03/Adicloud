import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';

function Main() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://adicloud.onrender.com/assets/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, [token]);

  // Fetch assets based on selected category
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        let url = 'https://adicloud.onrender.com/assets';
        if (categoryFilter) {
          url += `?category=${categoryFilter}`;
        }

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
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

      {/* Category Filter */}
      <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
        <option value="">All Categories</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Asset List */}
      <ul>
        {assets.map((asset) => (
          <li key={asset._id} style={{ marginBottom: '20px' }}>
            {/* Show first image only */}
            {asset.files.length > 0 && (
              <img
                src={asset.files[0]}
                alt={asset.name}
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
            )}
            <br />
            <strong>{asset.name}</strong> - {asset.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Main;
