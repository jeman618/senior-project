// packages/frontend/src/login.jsx

import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import { useForm } from "react-hook-form";

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

function Favorite() {
    const [favorite, setFavorite] = useState(null);

    useEffect(() => {
        async function loadFavorite() {
            const token = localStorage.getItem("token");
            
            if (!token || !isTokenValid(token)) {
                redirectToLogin();
                return;
            }

            const user_res = await fetch("http://localhost:8000/users/profile", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })

            if (user_res.status === 401) {
                redirectToLogin();
                return;
            }

            const user = await user_res.json();
            const res = await fetch(`http://localhost:8000/favorites/${user.id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })

            const favorite = await res.json();
            console.log(favorite[1])
            setFavorite(favorite[1]);
        }

        loadFavorite();
    }, []);

    if (!favorite) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <h1>{favorite.name}</h1>
        <div className="card">
            <h1>{favorite.description}</h1>
        </div>
        <ul>
            {favorite.plants.map((plant, index) => (
                <h2 key={index}>{plant}</h2>
            ))}
        </ul>
        </>
    );
}

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(<Favorite />);