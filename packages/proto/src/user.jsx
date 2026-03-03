import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import { useForm } from "react-hook-form";

async function getFavorites(user_id) {
    try {
        const res = await fetch(`http://localhost:8000/favorites/${user_id}`)
        const data = await res.json()
        console.log(data[0])
        return data[0]
    }
    catch (err) {
        console.error("Failed to load favorites: ", err)
        return
    }
}

async function loadProfile() {
    const res = await fetch("http://localhost:8000/users/profile", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    })

    const user = await res.json();

    const favorites = await getFavorites(user.id);
    document.getElementById("favorites").innerText = JSON.stringify(favorites, null,);
    document.getElementById("username").innerText = user.name;
    document.getElementById("email").innerText = user.email;
    document.getElementById("password").innerText = user.password;
}

function User() {
    const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
        } = useForm();

        const [loginError, setLoginError] = useState();
            const emailValue = watch("email");
            const passwordValue = watch("password");
            
            const onSubmit = async (data) => {
                setLoginError("");
                try {
                    const res = await fetch("http://localhost:8000/user", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    });
        
                    if (!res.ok) {
                        setLoginError("Email or Password is not matching with our record");
                        return;
                    }
        
                    if (res.status === 200) {
                        window.location.href = "index.html";
                    }
                    
                }
                catch (err) {
                    setLoginError("An error occurred during login");
                }
            };
        
            useEffect(() => {
                if ((emailValue || passwordValue) && loginError) {
                    setLoginError("");
                }
            }, [emailValue, passwordValue]);

    loadProfile()

    return (
        <>
        <div class="middle">
        <h1>Account Information</h1>
        <div class="card">
            <div class="row">
            <h1>Name</h1>
            <h2 id="username"></h2>
            </div>
            <div class="row">
            <h1>Email</h1>
            <h2 id="email"></h2>
            </div>
            <div class="row">
            <h1>Password</h1>
            <h2 id="password"></h2>
            </div>
        </div>
        <h1>Favorites</h1>
        <div class="card">
            <h1>Favorites</h1>
            <h2 id="favorites"></h2>
        </div>

        <div class="card">
            <h1>Add New Plant</h1>
            <h3>Add any plants you wish other users can grow! Just make sure you are an expert</h3>
        </div>
        </div>  
        </>
    )
}

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
loadProfile()
root.render(<User />);