import React from "react";
import ReactDOMClient from "react-dom/client";
import { useState, useEffect } from "react";

function UserMenu() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "index.html"
    };

    return (
    <>
    <div className="dropdown">
        <img className="login" src="/images/user.png" alt="Login"/>
        <div className="dropdown-content">
        {!isLoggedIn ? (
            <>
            <a href="/src/login.html"><p>Sign In</p></a>
            <a href="/src/signup.html"><p>Sign Up</p></a>
            </>
        ) : (
            <>
            <a href="/src/user.html"><p>Profile</p></a>
            <p onClick={handleLogout}>Log Out</p>
            </>
        )}
        </div>
    </div>
    </>
    )
}

const container = document.getElementById("dropMenu");
const root = ReactDOMClient.createRoot(container);
root.render(<UserMenu />);