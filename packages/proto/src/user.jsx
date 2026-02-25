import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import { useForm } from "react-hook-form";

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
                    const res = await fetch("http://localhost:8000/login", {
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

    return (
        <>
        <div class="middle">
        <h1>Account Information</h1>
        <div class="card">
            <h1>Name</h1>
            <h1>Email</h1>
            <h1>Password</h1>
        </div>
        <h1>Favorites</h1>
        <div class="card">
            <h1>Favorites</h1>
            <h2>Mr. Moo</h2>
        </div>

        <div class="card">
            <h1>Add New Plant</h1>
            <h3>Add any plants you wish other users can grow! Just make sure you are an expert</h3>
        </div>
        </div>
        </>
    )
}

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(<User />);