import React, { useState, useEffect, useRef } from 'react';
import LogoC from '../assets/adicould.svg';
import IconProfile from '../assets/icon_profile.svg';
import '../dropdownmenuA.css';

const Header = ({ statusFilter, setStatusFilter }) => {
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
                        <a href="/dashboard" className= "dropbtn">Requests</a>
                        <div className="dpdcont">
                            <a href="/dashboard">All</a>
                            <a href="/dashboard/Pending" >Pending</a>
                            <a href="/dashboard/Approved" >Approved</a>
                            <a href="/dashboard/Rejected">Rejected</a>
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
                        <a href="/requests">Requests</a>
                        <a href="/">Log Out</a>
                    </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;