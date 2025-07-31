import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import { Link } from 'react-router-dom';


function Main() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const token = localStorage.getItem('token');

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
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setCategoryFilter('')}
          style={{
            backgroundColor: categoryFilter === '' ? '#007bff' : '#e0e0e0',
            color: categoryFilter === '' ? '#fff' : '#000',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          All Categories
        </button>

        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setCategoryFilter(cat)}
            style={{
              backgroundColor: categoryFilter === cat ? '#007bff' : '#e0e0e0',
              color: categoryFilter === cat ? '#fff' : '#000',
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Asset List */}
      <ul>
        {assets.map((asset) => (
          <li key={asset._id} style={{ marginBottom: '20px' }}>
            <Link to={`/galery/${asset._id}`}>
            {/* Show first image only */}
            {asset.files.length > 0 && (
              <img
                src={asset.files[0]}
                alt={asset.name}
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
            )}
            <br />
            <strong>{asset.name}</strong>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Main;
