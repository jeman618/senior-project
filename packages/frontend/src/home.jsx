// packages/frontend/src/main.jsx

import React from "react";
import ReactDOMClient from "react-dom/client";
import Header from "./header.jsx";

function Home() {
    return (
        <>
        <Header />
        <div className="middle">
        <div className="promo">
            <img className="promo-img" src="/images/promo.png" alt=""/>
            <div className="promo-txt">Learn to grow your favorite plants!</div>
        </div>
        <h1 className="featured-title">Featured Plants</h1>
        <div className="featured">
            <a href="/src/strawberry.html">
                <div className="featured-img">
                <h3>Strawberry</h3>
                <img src="/plants/img_strawberry.png" alt="Strawberry" />
                </div>
            </a>
            <div className="featured-img">
            <h3>Banana</h3>
            <img src="/plants/img_banana.png" alt="Banana"/>
            </div>
            <div className="featured-img">
            <h3>Raspberry</h3>
            <img src="/plants/img_raspberry.png" alt="Raspberry"/>
            </div>
            <div className="featured-img">
            <h3>Blackberry</h3>
            <img src="/plants/img_blackberry.png" alt="Blackberry"/>
            </div>
        </div>
        <br></br>
            <div className="bottom">
                <a href="about.html"><h1>About Us</h1></a>
            </div>
        </div>
        </>
    );
}

const container = document.getElementById("home");
const root = ReactDOMClient.createRoot(container);
root.render(<Home />);