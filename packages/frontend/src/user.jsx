// packages/frontend/src/user.jsx

import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import { useForm } from "react-hook-form";
import { userHeader } from "./header";

function isTokenValid(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch (err) {
        return false;
    }
}

function redirectToLogin() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

async function getFavorites(user_id) {
    try {
        const res = await fetch(`http://localhost:8000/favorites/${user_id}`)
        const data = await res.json()
        return data
    }
    catch (err) {
        console.error("Failed to load favorites: ", err)
        return
    }
}

function User() {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
        
    useEffect(() => {
        async function loadProfile() {
            const token = localStorage.getItem("token");
            
            if (!token || !isTokenValid(token)) {
                redirectToLogin();
                return;
            }

            const res = await fetch("http://localhost:8000/users/profile", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })

            if (res.status === 401) {
                redirectToLogin();
                return;
            }

            const user = await res.json();
            setUser(user);

            const favorites = await getFavorites(user.id);
            setFavorites(favorites || []);
        }
        loadProfile();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
        < userHeader />
        <div className="middle">
        <h1>Account Information</h1>
        <div className="card">
            <div className="row">
            <h1>Name</h1>
            <h2>{user.name}</h2>
            </div>
            <div className="row">
            <h1>Email</h1>
            <h2>{user.email}</h2>
            </div>
            <div className="row">
            <h1>Password</h1>
            <h2>{user.password}</h2>
            </div>
        </div>

        <h1>Favorites</h1>
        <div className="card">
            <div className="favorites">
                {favorites.length > 0 ? (
                    favorites.map((favorite) => (
                        
                        <h2 key={favorite.id} id="favorite">{favorite.name}</h2>
                    ))
                ) : (
                    <h2 id="favorite">No favorites yet.</h2>
                )}
            </div>
        </div>

        <h1>Add New Plant</h1>
        <div className="card">
            <h3>Add any plants you wish other users can grow! Just make sure you are an expert</h3>
        </div>
        </div>  
        </>
    )
}

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(<User />);