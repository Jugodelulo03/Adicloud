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


function Main() {
  const { status } = useParams();
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState(status || '');
  const [categoryFilter, setCategoryFilter] = useState('');
  const token = localStorage.getItem('token');

  // Fetch categories from backend
  useEffect(() => {
  const fetchCategoriesWithAssets = async () => {
    try {
      const res = await axios.get('https://adicloud.onrender.com/assets/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const categoryList = res.data;

      const previews = {};

      // Para cada categoría, busca el primer asset que tenga esa categoría
      await Promise.all(
        categoryList.map(async (cat) => {
          try {
            const assetRes = await axios.get(`https://adicloud.onrender.com/assets?category=${cat}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (assetRes.data.length > 0) {
              previews[cat] = assetRes.data[0].files[0]; // primera imagen del primer asset
            }
          } catch (error) {
            console.warn(`No assets for category ${cat}`);
          }
        })
      );

      setCategories(
        categoryList.map((cat) => ({
          name: cat,
          previewImage: previews[cat] || null,
        }))
      );
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  fetchCategoriesWithAssets();
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
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
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

    <div className="wrapper"> 
      <Header statusFilter={statusFilter} setStatusFilter={setStatusFilter} role={"user"}/>
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
            {assets.map((asset) => (
              <Link to={`/galery/${asset._id}`} className='nameAsset'>
                <AssetCard key={asset._id} asset={asset} />
              </Link>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
    
  );
}
export default Main;
