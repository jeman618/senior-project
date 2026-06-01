// packages/frontend/src/header.jsx

import React, { useState, useEffect } from "react";
import UserMenu from "./dropMenu.jsx";

function HomeHeader() {
    return (
    <header>
        <div className="title">
            <img className="logo" src="/garden-guru/images/logo.png" alt = ""/>
            <h1>GardenGuru</h1>
        </div>
        
        <UserMenu />
    </header>
    );
}

function Header() {
    return (
    <header>
    <a href="index.html">
    <div className="title">
        <img className="logo" src="/garden-guru/images/logo.png" alt = ""/>
        <h1>GardenGuru</h1>
    </div>
    </a>

    <UserMenu />
    </header> 
    );
}

function UserHeader() {
    return (
    <header>
    <a href="index.html">
    <div className="title">
        <img className="logo" src="/garden-guru/images/logo.png" alt = ""/>
        <h1>GardenGuru</h1>
    </div>
    </a>
    </header> 
    );
}

export default Header;
export { HomeHeader, UserHeader };
