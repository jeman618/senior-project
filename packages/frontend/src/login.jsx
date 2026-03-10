// packages/frontend/src/login.jsx

import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import { useForm } from "react-hook-form";

function Login() {
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
                const data = await res.json();
                localStorage.setItem("token", data.token)
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
        <div className="page">
            <div className="card">
                
                <img src="/images/logo.png" alt = ""/>
                <h2>SIGN IN</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="email"
                        {...register("email", { required: true })}
                        placeholder="Email"
                    />

                    <input
                        type="password"
                        {...register("password", { required: true })}
                        placeholder="Password"
                    />
                    <br></br>
                    {loginError && <span style={{ color: "red" }}>{loginError}</span>}

                    <input type="submit" className="loginBtn" value="Login" />
                    <p className="signup">
                        Don't have an account? <a href="signup.html">Sign Up</a>
                    </p>
                </form>
            </div>
        </div>
        </>
    );
}

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(<Login />);