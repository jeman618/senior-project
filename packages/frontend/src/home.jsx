// packages/frontend/src/main.jsx

import React from "react";
import ReactDOMClient from "react-dom/client";
import { HomeHeader } from "./header.jsx";

function goToPlant(plantName) {
    localStorage.setItem("plantName", plantName);
    window.location.href = "/src/plant.html";
}

function Home() {
    return (
        <>
        <HomeHeader />
        <div className="middle">
        <div className="menu">
            <a href="/src/plants.html"><h1>Plants</h1></a>
            <a href="/src/recommended.html"><h1>User Recommended</h1></a>
            <a href="/src/location.html"><h1>Plants For You</h1></a>
        </div>
        <hr></hr>
        <div className="promo">
            <img className="promo-img" src="/images/promo.png" alt=""/>
            <div className="promo-txt">Learn to grow your favorite plants!</div>
        </div>
        <h1 className="featured-title">Featured Plants</h1>
        <div className="featured">
            <div className="featured-img" onClick={() => goToPlant("Strawberries")}>
                <h3>Strawberries</h3>
                <img src="/plants/img_strawberry.png" alt="Strawberries" />
            </div>
            <div className="featured-img">
                <h3>Banana</h3>
                <img src="/plants/img_banana.png" alt="Banana"/>
            </div>
            <div className="featured-img" onClick={() => goToPlant("Raspberries")}>
                <h3>Raspberries</h3>
                <img src="/plants/img_raspberry.png" alt="Raspberries"/>
            </div>
            <div className="featured-img">
                <h3>Blackberries</h3>
                <img src="/plants/img_blackberry.png" alt="Blackberries"/>
            </div>
        </div>
        <br></br>
        </div>
        <div className="bottom">
            <a href="/src/about.html"><h1>About Us</h1></a>
        </div>
        </>
    );
}

const container = document.getElementById("home");
const root = ReactDOMClient.createRoot(container);
root.render(<Home />);