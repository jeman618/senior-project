// packages/frontend/src/header.jsx

import React from "react";
import UserMenu from "./dropMenu.jsx";

function Header() {
    return (
    <header>
        <a href="index.html">
        <div className="title">
            <img className="logo" src="/images/logo.png" alt = ""/>
            <h1>GardenGuru</h1>
        </div>
        </a>

        <div className="topnav">
            <input type="text" placeholder="Search..." />
        </div>
        <UserMenu />
    </header>
    );
}

function HomeHeader() {
    return (
    <header>
        <div className="title">
            <img className="logo" src="/images/logo.png" alt = ""/>
            <h1>GardenGuru</h1>
        </div>

        <div className="topnav">
            <input type="text" placeholder="Search..." />
        </div>
        <UserMenu />
    </header>
    );
}

function UserHeader() {
    return (
    <header>
    <a href="index.html">
    <div className="title">
        <img className="logo" src="/images/logo.png" alt = ""/>
        <h1>GardenGuru</h1>
    </div>
    </a>
    </header> 
    );
}

export default Header;
export { UserHeader, HomeHeader };
