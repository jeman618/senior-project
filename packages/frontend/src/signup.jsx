// packages/frontend/src/signup.jsx

import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import { useForm } from "react-hook-form";

function Signup() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const [signupError, setSignupError] = useState();
    const nameValue = watch("name");
    const emailValue = watch("email");
    const passwordValue = watch("password");
    
    const onSubmit = async (data) => {
        setSignupError("");
        try {
            const res = await fetch("http://localhost:8000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                setSignupError("User already exists");
                return;
            }

            if (res.status === 200) {
                window.location.href = "index.html";
            }
            
        }
        catch (err) {
            setSignupError("An error occurred during signup");
        }
    };

    useEffect(() => {
        if ((nameValue || emailValue || passwordValue) && signupError) {
            setSignupError("");
        }
    }, [nameValue, emailValue, passwordValue]);

    return (
        <>
        <div className="page">
            <div className="card">
                <img src="/images/logo.png" alt = ""/>
                <h2>SIGN UP</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="name"
                    {...register("name", { required: true })}
                    placeholder="Name"
                />

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
                {signupError && <span style={{ color: "red" }}>{signupError}</span>}

                <input type="submit" className="loginBtn" value="Sign Up" />
                </form>
            </div>
        </div>
        </>
    );
}

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(<Signup />);
