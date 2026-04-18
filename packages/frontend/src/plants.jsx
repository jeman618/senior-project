import React , { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import Header from "./header.jsx";

function goToPlant(plantName) {
    localStorage.setItem("plantName", plantName);
    window.location.href = "/src/plant.html";
}

function Plants() {
    const [plants, setPlants] = useState([]);
    
    useEffect(() => {
        async function getPlants() {
            try {
                const res = await fetch("http://localhost:8000/plants");
                const plants = await res.json();

                setPlants(plants);
                console.log(plants);
            }
            catch (err) {
                console.error("Failed to load plants: ", err);
            }
        }
        getPlants();
    }, []);

    return (
        <>
        <Header />
        <div className="middle">
        <div className="featured">
            {plants.map((plant) => (
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