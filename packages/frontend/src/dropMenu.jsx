// packages/frontend/src/dropMenu.jsx

import React from "react";
import ReactDOMClient from "react-dom/client";
import { useState, useEffect } from "react";

function isTokenValid(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch (err) {
        return false;
    }
}

function UserMenu() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");

            if (token && isTokenValid(token)) {
                setIsLoggedIn(true);
            } 
            else {
                setIsLoggedIn(false);
            }
        }
        catch (err) {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        window.location.href = "/garden-guru/index.html"
    };

    return (
    <>
    <div className="dropdown">
        <img className="login" src="/images/user.png" alt="Login"/>
        <div className="dropdown-content">
        {!isLoggedIn ? (
            <>
            <a href="/garden-guru/src/login.html"><p>Log In</p></a>
            <a href="/garden-guru/src/signup.html"><p>Sign Up</p></a>
            </>
        ) : (
            <>
            <a href="/garden-guru/src/user.html"><p>Profile</p></a>
            <p onClick={handleLogout}>Log Out</p>
            </>
        )}
        </div>
    </div>
    </>
    )
};

export default UserMenu;