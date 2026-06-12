// packages/frontend/src/plant.jsx

import React , { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import UserMenu from "./dropMenu.jsx";

function goToPlant(plantName) {
    localStorage.setItem("plantName", plantName);
    window.location.href = "/senior-project/src/plant.html";
}

// search function that lets users look for any plants that match what's searched
function SearchHeader({ search, setSearch }) {
    return (
    <header>
        <a href="/senior-project/index.html">
        <div className="title">
            <img className="logo" src="/senior-project/images/logo.png" alt = ""/>
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
            <div className="menu">
            <a href="/senior-project/src/recommended.html"><h1 style={{textAlign: "center"}}>User Recommended</h1></a>
            <a href="/senior-project/src/location.html"><h1 style={{textAlign: "center"}}>Plants For You</h1></a>
            </div>
            <hr></hr>
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
            <a href="/senior-project/src/about.html"><h1>About Us</h1></a>
        </div>
        </>
    );
}

const container = document.getElementById("plants");
const root = ReactDOMClient.createRoot(container);
root.render(<Plants />)
