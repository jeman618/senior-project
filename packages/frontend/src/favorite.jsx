// packages/frontend/src/login.jsx

import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import { set, useForm } from "react-hook-form";
import Header from "./header.jsx";

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

function goToPlant(plantName) {
    localStorage.setItem("plantName", plantName);
    window.location.href = "/src/plant.html";
}

function Favorite() {
    const [favorite, setFavorite] = useState(null);
    const [plants, setPlants] = useState([]);

    useEffect(() => {
        async function loadFavorite() {
            const token = localStorage.getItem("token");
            
            if (!token || !isTokenValid(token)) {
                redirectToLogin();
                return;
            }

            const user_res = await fetch("/api/users/profile", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })

            if (user_res.status === 404 || user_res.status === 401) {
                redirectToLogin();
                return;
            }

            const favorite_id = localStorage.getItem("favoriteId");
            const res = await fetch(`/api/favorite/${favorite_id}`)

            const favorite = await res.json();
            console.log(favorite[0]);
            setFavorite(favorite[0]);

            const plantsData = [];

            // Fetches the image for each plant in the favorite list
            for (let i = 0; i < favorite[0].plants.length; i++) {
                const plant = favorite[0].plants[i];
                const image_res = await fetch(`/api/plants/${plant}`);
                if (image_res === 404) {
                    console.error(`Failed to load image for plant ${plant}: `, image_res.statusText);
                    continue;
                }
                const image_data = await image_res.json();
                plantsData.push({ [plant]: image_data[0].image });
            }

            setPlants(plantsData);
        }
        loadFavorite();

    }, []);

    if (!favorite) {
        return <>Loading...</>;
    }

    return (
        <>
        <Header />
        <div className="middle">
            
        <h1>{favorite.name}</h1>
        <div className="card">
            <h2>{favorite.description}</h2>
        </div>
        <div className="featured">
            {plants.map((plant, index) => {
                const plantName = Object.keys(plant)[0];
                console.log("Rendering plant: ", plantName);
                return (
                    <div key={index} className="featured-img" onClick={() => goToPlant(plantName)}>
                        <h2>{plantName}</h2>
                        <img src={plant[plantName]} alt={plantName} />
                    </div>
                );
            })}
        </div>
        </div>
        <div className="bottom">
            <a href="/src/about.html"><h1>About Us</h1></a>
        </div>
        </>
    );
}

const container = document.getElementById("favorite-root");
const root = ReactDOMClient.createRoot(container);
root.render(<Favorite />);