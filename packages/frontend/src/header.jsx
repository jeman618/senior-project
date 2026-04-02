// packages/frontend/src/header.jsx

import React from "react";
import UserMenu from "./dropMenu.jsx";

function Header() {
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

function userHeader() {
    return (
    <header>
    <div class="title">
        <a href="index.html">
        <img class="logo" src="/images/logo.png" alt = ""/>
        <h1>GardenGuru</h1>
        </a>
    </div>
    </header> 
    );
}

export default Header;
export { userHeader };