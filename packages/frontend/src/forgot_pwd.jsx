// packages/frontend/src/forgot_pwd.jsx

import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import { useForm } from "react-hook-form";

function Pwd() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const email = watch("email");
    const newPwd = watch("newPwd");
    const retypedPwd = watch("retypedPwd");
    const [showPw, setShowPw] = useState(false);
    const [pwdError, setPwdError] = useState();
    
    const onSubmit = async (data) => {
        setPwdError("");
        try {
            const res = await fetch("/api/password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if (res.status == 400) {
                setPwdError("New password cannot be the same as old password");
                return;
            }
            else if (res.status == 401) {
                setPwdError("Could not find user");
                return;
            }
            else if (res.status == 403) {
                setPwdError("Passwords must match");
                return;
            }
            else if (res.status == 500) {
                setPwdError("An error occurred on the server");
                return;
            }
            else {
                window.location.href = "login.html";
            }
            
        }
        catch (err) {
            setPwdError("An error occurred trying to change password");
            return;
        }
    };

    return (
        <>
        <div className="page">
            <div className="card">
                <img src="/senior-project/images/logo.png" alt = ""/>
                <h1>CHANGE PASSWORD</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Email"
                    onChange={() => {
                        setPwdError("");
                    }}
                />

                <input
                    type={showPw ? "text" : "password"}
                    {...register("newPwd", { required: true })}
                    placeholder="New Password"
                    onChange={() => {
                        setPwdError("");
                    }}
                />

                <input
                    type={showPw ? "text" : "password"}
                    {...register("retypedPwd", { required: true })}
                    placeholder="Retype Password"
                    onChange={() => {
                        setPwdError("");
                    }}
                />

                <div className="showPw">
                    <input 
                        className="pw_checkbox"
                        type="checkbox"
                        checked={showPw}
                        onChange={() => setShowPw(prev => !prev)}
                    />
                    <p>Show Password</p>
                </div>

                {pwdError && <span className="error">{pwdError}</span>}

                <input type="submit" className="loginBtn" value="Submit" />
                </form>
            </div>
        </div>
        </>
        );
}

const container = document.getElementById("forgot_pwd_root");
const root = ReactDOMClient.createRoot(container);
root.render(<Pwd />);