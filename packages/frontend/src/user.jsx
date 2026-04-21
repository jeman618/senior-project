// packages/frontend/src/user.jsx

import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import { UserHeader } from "./header";

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

function headToFavorite(favoriteId) {
    localStorage.setItem("favoriteId", favoriteId);
    console.log("Favorite ID set to: ", localStorage.getItem("favoriteId"));
    window.location.href = "favorite.html";
}

async function getFavorites(user_id) {
    try {
        const res = await fetch(`http://localhost:8000/favorites/${user_id}`);
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.error("Failed to load favorites: ", err);
        return;
    }
}

async function deleteFavorites() {

}

function goAddFav() {
    window.location.href = "addfav.html";
}

function User() {

    const [user, setUser] = useState(null);
    const [password, setPassword] = useState("");
    const [favorites, setFavorites] = useState([]);

    const [isRemoving, setIsRemoving] = useState(false);
    const [selectedToRemove, setSelectedToRemove] = useState([]);

    function handleRemoveClick() {
        setIsRemoving(true);
        setSelectedToRemove([]);
    }

    function handleCancelRemove() {
        setIsRemoving(false);
        setSelectedToRemove([]);
    }

    // will add or remove favorites in the selectedToRemove list
    function handleCheckboxChange(favoriteId) {
        setSelectedToRemove((prev) =>
        prev.includes(favoriteId)
            ? prev.filter((id) => id !== favoriteId)
            : [...prev, favoriteId]
        );
    }

    async function handleConfirmRemove() {
        console.log("Removing these favorites: ", selectedToRemove);

        const user_id = user.id;

        const res = await fetch("http://localhost:8000/favorites", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({selectedToRemove, user_id}),
        });

        if (res.status == 200) {
            window.location.href = "user.html";
        }

        setIsRemoving(false);
        setSelectedToRemove([]);
    }

    function FavoriteMenu() {
        return (
        <>
        <div className="button right_button">
        <div className="dropdown">
            <h1 className="arrow_down">▼</h1>
            {!isRemoving ? (
            <div className="favorites_dropdown dropdown-content">
                <p onClick = {() => goAddFav()}>Add</p>
                <p onClick = {() => handleRemoveClick()}>Remove</p>
            </div>
            ) : 
            (
            <div className="favorites_dropdown dropdown-content">
                <p onClick = {() => handleConfirmRemove()}>Confirm</p>
                <p onClick = {() => handleCancelRemove()}>Cancel</p>
            </div>
            )}
        </div>
        </div>
        </>
    );
    };

    function renderFavorites(favorites) {
        return (
        <>
        <div className="card">
            <div className="favorites">
                {favorites.length > 0 ? (
                    favorites.map((favorite) => (
                    <div key={favorite.id} className="checkbox_row">
                        {isRemoving && (
                        <input
                        type="checkbox"
                        className = "fav_checkbox"
                        checked={selectedToRemove.includes(favorite.id)}
                        onChange={() => handleCheckboxChange(favorite.id)}
                        />
                        )}
                        <h2
                        id="favorite" 
                        onClick={() => headToFavorite(favorite.id)}>{favorite.name}</h2>
                    </div> 
                    ))
                ) : (
                    <h2 id="favorite">No favorites yet.</h2>
                )}
            </div>
        </div>
        </>
        );
    }
        
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

            setPassword("*".repeat(4));

            const favorites = await getFavorites(user.id);
            setFavorites(favorites || []);
        }
        loadProfile();
    }, []);

    if (!user) {
        return <>Loading...</>;
    }

    return (
        <>
        <UserHeader />
        <div className="middle">
        <br></br>
        <h1>Account Information</h1>
        <div className="card">
            <div className="row">
            <h1>Profile</h1>
            <img className="profile-img" src={user.image} alt=""/>
            </div>
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
            <h2>{password}</h2>
            </div>
            <h1 className="edit">Edit</h1>
        </div>

        <div className="fav_row">
            <h1></h1>
            <h1>Favorites</h1>
            <FavoriteMenu />
        </div>
        {renderFavorites(favorites)}

        <h1>Add New Plant</h1>
        <div className="card">
            <h3>Add any plants you wish other users can grow! Just make sure you are an expert</h3>
        </div>
        
        </div>  
        </>
    )
}

const container = document.getElementById("user");
const root = ReactDOMClient.createRoot(container);
root.render(<User />);