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
    const [imgs, setImgs] = useState();

    async function getImg(userId) {
        try {
            const user = await fetch(`/api/users/${userId}`);
            const user_data = await user.json();
            return user_data.img;
        }
        catch(err) {

        }
    }

    useEffect(() => {
        async function getFavorites() {
            try {

                const users = await fetch("/api/users");
                const user_data = await users.json();

                const input = [];
                for (let i = 0; i < user_data.length; i++) {
                    const users_favs = await fetch(`/api/favorites/${user_data[i].id}`);
                    if (users_favs.status == 404) {
                        continue;
                    }
                    const users_favs_data = await users_favs.json();
                    input.push({[user_data[i].name] : users_favs_data});
                }
                
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
        <h1 className="title_recommended">Recommended</h1>
        <div className="middle">
            {data.map((list, index) => {
                const userName = Object.keys(list)[0];
                const favs = list[userName];
                
                return favs.map((fav, favIndex) => (
                    <div key={`${index}-${favIndex}`} className="card" onClick ={() => goToFavorite(fav.id)}>
                        <h1>{fav.name}</h1>
                        <h2>{userName}</h2>
                        {/* <img src="/images/logo.png" alt="H"/> */}
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