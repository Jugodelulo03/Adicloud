import React, { useState, useEffect, useRef } from 'react';
import LogoC from '../assets/adicould.svg';
import IconProfile from '../assets/icon_profile.svg';
import './header.css';
import ConfirmationPopup from './ConfirmationPopUp.js';

const Header = ({ statusFilter, setStatusFilter, role }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [userName, setUserName] = useState('');
    const dropdownRef = useRef(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true); 
        setShowDropdown(false); 
    };

    // Confirm and perform logout (clear localStorage and redirect)
    const confirmLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    // Close dropdown if user clicks outsid
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

    // Fetch and set user's name using token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('https://adicloud.onrender.com/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
            if (res.status === 403) {
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/';
                return;
            }
            return res.json();
            })
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
                    <a href="/">
                        <img src={LogoC} alt="Logo" className="logoC" />
                    </a>
                    {role === 'admin' && (   // Menu for admin 
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
                            <a href="/admingallery" className= "dropbtn gallery"> Gallery</a>
                        </nav>
                    )}

                    {role === 'user' && (   // Menu for regular user
                        <nav className="menu1"> 

                            <a href="/" className= "dropbtn gallery"> Gallery</a>

                            <div className="requestmenu">
                                <a href="/myrequests" className= "dropbtn">My Requests</a>
                                <div className="dpdcont">
                                    <a href="/myrequests">All</a>
                                    <a href="/myrequests/Pending" >Pending</a>
                                    <a href="/myrequests/Approved" >Approved</a>
                                    <a href="/myrequests/Rejected">Rejected</a>
                                </div>
                            </div>
                        </nav>
                    )}
                <div className="user-info" ref={dropdownRef}>
                    <div className="profile-menu" onClick={() => setShowDropdown(!showDropdown)}>
                        <span className='maxW'>Hi, {userName || '...'}</span>
                        <img src={IconProfile} alt="Usuario" className="user-icon" />
                    </div>

                    {showDropdown && role === "admin" &&(
                    <div className="profile-dropdown">
                        <a href="/dashboard">Requests</a>
                        <button onClick={handleLogoutClick} className="logout-btn">Log Out</button>
                    </div>
                    )}

                    {showDropdown && role === "user" &&(
                    <div className="profile-dropdown">
                        <a href="/myrequests">My Requests</a>
                        <button onClick={handleLogoutClick} className="logout-btn">Log Out</button>
                    </div>
                    )}
                    {showLogoutConfirm && (
                        <ConfirmationPopup
                            message="Are you sure you wanna log out?"
                            onConfirm={confirmLogout}
                            onCancel={cancelLogout}
                        />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;