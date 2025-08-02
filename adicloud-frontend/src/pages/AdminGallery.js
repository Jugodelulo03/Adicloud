import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import AssetCard from './components/AssetCard';
import Footer from './components/footer';
import './UserDash.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Logo from './assets/logo_tradicional.svg';
import './AdminGallery.css'
import AddpackPopup from './components/AddpackPopup';


function Main() {
  const { status } = useParams();
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState(status || '');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const token = localStorage.getItem('token');

    // GET assests
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
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
        }
    };

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
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
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

  if (assets.length === 0) return (
  <div className='menu1'>
      <img src={Logo} alt="Logo" className="fade-in-logo" />
    </div>
);


  return (

    <div>  
      <Header statusFilter={statusFilter} setStatusFilter={setStatusFilter} role={"admin"}/>
      <div className='body'>
        <h2>ASSETS</h2>
        <h3>CATEGORIES</h3>
        <div className='bg'></div>
        <div className='overflowCategories'>
          <CategoryCard
            categories={categories}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        </div>
        <div className='divider1'></div>
        <div>
          <ul className='conteinerMain'>
            <li className="add-pack-card" onClick={() => setShowPopup(true)}>
                <div className="add-pack-circle">+</div>
                <p>Add a Pack</p>
            </li>
            {showPopup && (
                <AddpackPopup
                    categories={categories}
                    token={token}
                    onClose={() => {
                        setShowPopup(false);
                        fetchAssets();
                    }}
                />
            )}
            {assets.map((asset) => (
                <AssetCard key={asset._id} asset={asset} />
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Main;
