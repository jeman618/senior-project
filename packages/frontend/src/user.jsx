// packages/frontend/src/user.jsx

import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import { useForm } from "react-hook-form";
import { UserHeader } from "./header";
import Logout from "./logout"

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
    window.location.href = "/garden-guru/login.html";
}

async function DeleteAccount(user_id) {
    try {
        const res = await fetch("/api/users", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({user_id})
        });

        if (res.status === 500) {
            console.log("oh no");
        }
        else if (res.status === 401) {
            redirectToLogin()
        }
        else {
            localStorage.removeItem("token");
            window.location.href = "/garden-guru/index.html";
        }
    }
    catch (err) {

    }
}

function headToFavorite(favoriteId) {
    localStorage.setItem("favoriteId", favoriteId);
    console.log("Favorite ID set to: ", localStorage.getItem("favoriteId"));
    window.location.href = "/garden-guru/favorite.html";
}

async function getFavorites(user_id) {
    try {
        const res = await fetch(`/api/favorites/${user_id}`);
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.error("Failed to load favorites: ", err);
        return;
    }
}

function goAddFav() {
    window.location.href = "/garden-guru/addfav.html";
}

// Handles whether user is in edit mode or not
function AccountInfo({
    editMode,
    hasProfile,
    user,
    password,
    register,
    handleEdit,
    handleCancelEdit,
    handleSubmit,
    onSubmit
}) {
    return (
        <>
        {!editMode ? (
        <>
        <div className="row">
        <h1>Profile</h1>
            <img className="profile-img" src={
                hasProfile ? (user.image) : ("/garden-guru/images/logo.png")
                } alt=""/>
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
        <div className="row-edit">
            <div></div>
            <div></div>
            <div></div>
            <h1 className="edit" onClick={() => handleEdit()}>Edit</h1>
        </div>
        </>
        ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
            <h1>Profile</h1>
            <img className="profile-img" src={
                hasProfile ? (user.image) : ("/garden-guru/images/logo.png")
                } alt=""/>
            </div>
            <div className="row">
                <h1>Name</h1>
                <input 
                type="text"
                className="user_input"
                {...register("name", { required: true })}
                placeholder="Enter name..." 
                />
            </div>
            <div className="row">
                <h1>Email</h1>
                <input 
                type="text"
                className="user_input"
                {...register("email", { required: true })}
                placeholder="Enter email..." 
                />
            </div>
            <div className="row">
                <h1>Password</h1>
                <input 
                type="text"
                className="user_input"
                {...register("password", { required: true })}
                placeholder="Enter password..." 
                />
            </div>
            <div className="row-edit">
                <button className="edit" type="submit">Confirm</button>
                <div></div>
                <div></div>
                <button className="edit" onClick={() => handleCancelEdit()}>Cancel</button>
            </div>
            </form>
        )}
        </>
    );
}

function User() {

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const [user, setUser] = useState([]);
    const [password, setPassword] = useState("");
    const [favorites, setFavorites] = useState([]);

    const [editMode, setEditMode] = useState(false);

    const [hasProfile, setHasProfile] = useState(false);

    const [isRemoving, setIsRemoving] = useState(false);
    const [selectedToRemove, setSelectedToRemove] = useState([]);

    function handleEdit() {
        setValue("name", user.name);
        setValue("email", user.email);
        setValue("password");
        setEditMode(true);
    }

    function handleCancelEdit() {
        setEditMode(false);
    }

    const onSubmit = async (data) => {

        const res = await fetch("/api/update", {
            method: "POST",
            headers: {
                    "Content-Type": "application/json",
                },
            body: JSON.stringify({...data, id: user.id})
        })

        setEditMode(false);

        if (!res.ok) {
            console.log("Could not update data");
            return;
        }
        window.location.href = "/garden-guru/user.html"
    };

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

        if (selectedToRemove.length == 0) {
            handleCancelRemove()
            return;
        }

        const user_id = user.id;

        const res = await fetch("/api/favorites", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({selectedToRemove, user_id}),
        });

        if (res.status == 200) {
            window.location.href = "/garden-guru/user.html";
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

            const res = await fetch("/api/profile", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })

            if (res.status == 401) {
                redirectToLogin();
                return;
            }

            const user = await res.json();
            setUser(user);

            if (user.image) {
                setHasProfile(true);
            }
            else {
                setHasProfile(false);
            }

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
            <AccountInfo 
                editMode={editMode}
                hasProfile={hasProfile}
                user={user}
                password={password}
                register={register}
                handleEdit={handleEdit}
                handleCancelEdit={handleCancelEdit}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                />
        </div>

        <div className="fav_row">
            <h1></h1>
            <h1>Favorites</h1>
            <FavoriteMenu />
        </div>
        {renderFavorites(favorites)}
        
        <div>
        <h2 className="user_button" onClick={() => Logout()}>Log Out</h2>
        <h2 style={{ color: "red" }} className="user_button" onClick={() => DeleteAccount(user.id)}>Delete Account</h2>
        </div>
        
        </div>
        </>
    )
}

const container = document.getElementById("user");
const root = ReactDOMClient.createRoot(container);
root.render(<User />);
