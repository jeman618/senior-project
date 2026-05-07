// packages/frontend/src/plant.jsx

import React , { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import UserMenu from "./dropMenu.jsx";

function goToPlant(plantName) {
    localStorage.setItem("plantName", plantName);
    window.location.href = "/src/plant.html";
}

function SearchHeader({ search, setSearch }) {
    return (
    <header>
        <a href="index.html">
        <div className="title">
            <img className="logo" src="/images/logo.png" alt = ""/>
            <h1>GardenGuru</h1>
        </div>
        </a>
        <div className="topnav">
            <input
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <UserMenu />
    </header>
    );
}

function Plants() {
    const [plants, setPlants] = useState([]);

    const [search, SetSearch] = useState("");
    const filteredPlants = plants.filter((plant) =>
        plant.name.toLowerCase().includes(search.toLowerCase())
    );
    
    useEffect(() => {
        async function getPlants() {
            try {
                const res = await fetch("/api/plants");
                const plants = await res.json();

                setPlants(plants);
            }
            catch (err) {
                console.error("Failed to load plants: ", err);
            }
        }
        getPlants();
    }, []);

    return (
        <>
        <SearchHeader search={search} setSearch={SetSearch}/>
        <div className="middle">
        <div className="featured">
            {filteredPlants.map((plant) => (
                <div key={plant.id} className="featured-img" onClick={() =>goToPlant(plant.name)}>
                    <h3>{plant.name}</h3>
                    <img src={plant.image} alt={plant.name}  />
                </div>   
            ))}
        </div>
        </div>
        <div className="bottom">
            <a href="/src/about.html"><h1>About Us</h1></a>
        </div>
        </>
    );
}

const container = document.getElementById("plants");
const root = ReactDOMClient.createRoot(container);
root.render(<Plants />)