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
    const [showPw, setShowPw] = useState(false);
    
    const onSubmit = async (data) => {
        setLoginError("");
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (res.status === 500) {
                setLoginError("An error occurred on the server");
                return;
            }
            else if (!res.ok) {
                setLoginError("Email or Password is not matching with our record");
                return;
            }
            else {
                const data = await res.json();
                localStorage.setItem("token", data.token);
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
                
                <div>
                <img src="/senior-project/images/logo.png" alt = ""/>
                <h1>LOG IN</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="email"
                        {...register("email", { required: true })}
                        placeholder="Email"
                    />

                    <input
                        type={showPw ? "text" : "password"}
                        {...register("password", { required: true })}
                        placeholder="Password"
                    />

                    <div className="pw">
                        <div className="forgot" onClick={() => window.location.href="forgot_pwd.html"}>
                        Forgot Password?
                        </div>
                        
                        <div className="showPw">
                        <input 
                            className="pw_checkbox"
                            type="checkbox"
                            checked={showPw}
                            onChange={() => setShowPw(prev => !prev)}
                        />
                        <p>Show Password</p>
                        </div>
                        
                    </div>
                    {loginError && <span className="error">{loginError}</span>}

                    <input type="submit" className="loginBtn" value="Login" />
                    <p className="signup">
                        Don't have an account? <span onClick={()=> window.location.href="signup.html"}>
                            Sign Up</span>
                    </p>
                </form>
            </div>
        </div>
        </>
    );
}

const root = ReactDOMClient.createRoot(document.getElementById("login"));
root.render(<Login />);