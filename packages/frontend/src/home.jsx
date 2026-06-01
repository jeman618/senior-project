// packages/frontend/src/home.jsx

import React, {useState, useEffect} from "react";
import ReactDOMClient from "react-dom/client";
import { HomeHeader } from "./header.jsx";

function goToPlant(plantName) {
    localStorage.setItem("plantName", plantName);
    window.location.href = "/senior-project/src/plant.html";
}

function getFeatured(plants) {
    return (
        <>
        <div className="featured">
            {plants.map((plant) => (
                <div key={plant.id} className="featured-img" onClick={() =>goToPlant(plant.name)}>
                    <h3>{plant.name}</h3>
                    <img src={plant.image} alt={plant.name}  />
                </div>   
            )).slice(0, 4)}
        </div>
        </>
    );
}

function Home() {
    const [plant, setPlant] = useState([]);
    
        useEffect(() => {
            async function getPlants() {
            try {
                const res = await fetch("/api/plants");
                const plants = await res.json();

                setPlant(plants);
            }
            catch (err) {
                console.error("Failed to load plants: ", err);
            }
        }
        getPlants();
        }, []);
    return (
        <>
        <HomeHeader />
        <div className="middle">
        <div className="menu">
            <a href="/senior-project/src/plants.html"><h1>All Plants</h1></a>
            <a href="/senior-project/src/recommended.html"><h1>User Recommended</h1></a>
            <a href="/senior-project/src/location.html"><h1>Plants For You</h1></a>
        </div>
        <hr></hr>
        <div className="promo">
            <img className="promo-img" src="/senior-project/images/promo.png" alt=""/>
            <div className="promo-txt">Learn to grow your favorite plants!</div>
        </div>
        <h1 className="featured-title">Featured Plants</h1>
        {getFeatured(plant)}
        <br></br>
        </div>
        <div className="bottom">
            <a href="/senior-project/src/about.html"><h1>About Us</h1></a>
        </div>
        </>
    );
}

const container = document.getElementById("home");
const root = ReactDOMClient.createRoot(container);
root.render(<Home />);
