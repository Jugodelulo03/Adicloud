import React from "react";
import LogoC from './assets/adicould.svg';
import IconProfile from './assets/icon_profile.svg';
import './dropdownmenuA.css';

const Header = () => {
    return(
        <header className="header">
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
                <a href="/home" className= "dropbtn gallery"> Gallery</a>
            </nav>
            <div className="user-info">
                <span>Hello, {}</span>
                <img src={IconProfile} alt="Usuario" className="user-icon"/>
            </div>
        </header>
    )
};

export default Header;