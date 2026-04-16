// packages/frontend/src/recommended.jsx

import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import Header from "./header";

function goToFavorite(favoriteId) {
    localStorage.setItem("favoriteId", favoriteId);
    console.log("Favorite ID set to: ", localStorage.getItem("favoriteId"));
    window.location.href = "favorite.html";
}

function Recommended() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function getFavorites() {
            try {

                const users = await fetch("http://localhost:8000/users");
                const user_data = await users.json();
                console.log("Users: ", user_data);

                const input = [];
                for (let i = 0; i < user_data.length; i++) {
                    const users_favs = await fetch(`http://localhost:8000/favorites/${user_data[i].id}`);
                    if (users_favs.status == 404) {
                        continue;
                    }
                    const users_favs_data = await users_favs.json();
                    input.push({[user_data[i].name] : users_favs_data});
                }
                console.log("Data: ", input);
                setData(input);
            }
            catch (err) {
                console.error("Failed to load recommended plants: ", err);
            }
        }
        getFavorites();
    }, []);
    return (
        <>
        <Header />
        <h1 className="title_recommended">Recommended Plants</h1>
        <div className="middle">
            {data.map((list, index) => {
                const userName = Object.keys(list)[0];
                const favs = list[userName];
                
                return favs.map((fav, favIndex) => (
                    <div key={`${index}-${favIndex}`} className="card" onClick ={() => goToFavorite(fav.id)}>
                        <h2>{fav.name}</h2>
                        <h2>{fav.description}</h2>
                        <h2>By: {userName}</h2>
                    </div>
                ));
            })}
        </div>
        <div className="bottom">
            <a href="/src/about.html"><h1>About Us</h1></a>
        </div>
        </>
    );
}

const container = document.getElementById("recommended");
const root = ReactDOMClient.createRoot(container);
root.render(<Recommended />);