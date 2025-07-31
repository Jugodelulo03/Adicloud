import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import AssetCard from './components/AssetCard';
import './UserDash.css';
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
  console.log('Assets:', assets);
  return (
    <div className='body'>
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
      <ul className='conteinerMain'>
        {assets.map((asset) => (
          <AssetCard key={asset._id} asset={asset} />
        ))}
      </ul>
    </div>
  );
}

export default Main;
