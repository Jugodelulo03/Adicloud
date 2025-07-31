import React, { useState, useEffect, useRef } from 'react';
import LogoC from '../assets/adicould.svg';
import IconProfile from '../assets/icon_profile.svg';
import '../dropdownmenuA.css';

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [userName, setUserName] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('https://adicloud.onrender.com/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.user && data.user.name) {
                    setUserName(data.user.name);
                } else {
                    setUserName('user');
                }
            })
            .catch(() => setUserName('userName'));
        }
    }, []);

    return(
        <header className="header">
            <div className="headerbox">
                    <img src={LogoC} alt="Logo" className="logoC" />
                <nav className="menu1">
                    <div className="requestmenu">
                        <button className= "dropbtn">Requests</button>
                        <div className="dpdcont">
                            <a href="/adicloud-frontend\src\pages\AdminDashboard.js">View All</a>
                            <a href="/">Pending</a>
                            <a href="/">Approved</a>
                            <a href="/">Rejected</a>
                        </div>
                    </div>
                    <a href="/" className= "dropbtn gallery"> Gallery</a>
                </nav>
                <div className="user-info" ref={dropdownRef}>
                    <div className="profile-menu" onClick={() => setShowDropdown(!showDropdown)}>
                        <span className='maxW'>Hi, {userName || '...'}</span>
                        <img src={IconProfile} alt="Usuario" className="user-icon" />
                    </div>

                    {showDropdown && (
                    <div className="profile-dropdown">
                        <a href="/adicloud-frontend\src\pages\AdminDashboard.js">Requests</a>
                        <a href="/">Log Out</a>
                    </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;