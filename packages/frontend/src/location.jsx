import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import Header from "./header";

function Location() {
    return (
        <>
        < Header/>
        <div className="middle">
        <h1>Location Time!</h1>
        </div>
        </>
    );
}

const container = document.getElementById("location-root");
const root = ReactDOMClient.createRoot(container);
root.render(<Location />);
