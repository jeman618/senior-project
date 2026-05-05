// packages/frontend/src/header.jsx

import React, { useState, useEffect } from "react";
import UserMenu from "./dropMenu.jsx";

function Header() {
    return (
    <header>
        <div className="title">
            <img className="logo" src="/images/logo.png" alt = ""/>
            <h1>GardenGuru</h1>
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
export { UserHeader };
