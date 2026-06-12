// packages/frontend/src/location.jsx

import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import Header from "./header";

function goToPlant(plantName) {
    localStorage.setItem("plantName", plantName);
    window.location.href = "/senior-project/src/plant.html";
}

function Location() {
    const [zip, setZip] = useState("");
    const [zone, setZone] = useState("");
    const [plants, setPlants] = useState([]);

    async function getPlants() {
        try {
            const res = await fetch("/api/plants");
            const data = await res.json();
            return data;
        }
        catch (err) {
            console.error("Failed to load plants: ", err);
        }
    }

    async function getPlantsInLocation() {
        try {
            if (navigator.geolocation) {
                // gets zipcode by getting latitude and longitude coordinates
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                const lat = position.coords.latitude;
                const long = position.coords.longitude;

                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`);
                const data = await res.json();
                const zip = data.address.postcode;
                setZip(`Zipcode: ${zip}`);

                // gets hardiness zone of zipcode
                const res_zone = await fetch(`https://plant-hardiness-zone.p.rapidapi.com/zipcodes/${zip}`, {
                    method: "GET",
                    headers: {
                        "x-rapidapi-key": "c487d7582fmshc6a2c58bbd736c1p136038jsn2e0ad6cfdb5d",
                        "x-rapidapi-host": "plant-hardiness-zone.p.rapidapi.com"
                }});
                const data_zone = await res_zone.json();

                const result = data_zone.hardiness_zone.match(/[a-zA-z]+|[0-9]+/g)
                const zone = result[0];
                setZone(`Hardiness zone: ${result.join('')}`);

                // matches plants with hardiness zone
                const plants = await getPlants();
                const plants_filtered = [];
                
                for (let i = 0; i < plants.length; i++) {
                    for (let j = 0; j < plants[i].locations.length; j++) {
                        if (plants[i].locations[j] === zone) {
                            plants_filtered.push(plants[i]);
                            break;
                        }
                    }
                }
                setPlants(plants_filtered);
        
            }
            else {

            }
        }
        catch (err) {
            console.error(err);
        }
    }
    
    useEffect(() => {
        
    }, [])
    
    return (
        <>
        <Header />
        <div className="middle">
        <div className="menu">
            <a href="/senior-project/src/plants.html"><h1>All Plants</h1></a>
            <a href="/senior-project/src/recommended.html"><h1>User Recommended</h1></a>
        </div>
        <hr></hr>
            <h1 className="title_location">Share your location to get plants catered to you! </h1>
            <img className="location-img" src='/senior-project/images/location.png' alt="Sun over fields"/>
            <button onClick={getPlantsInLocation} className="locate_button">Share Location</button>
            <h1>{zip}</h1>
            <h1>{zone}</h1>
            <div className="featured">
            {plants.map((plant) => (
                <div key={plant.id} className="featured-img" onClick={() => goToPlant(plant.name)}>
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

const container = document.getElementById("location-root");
const root = ReactDOMClient.createRoot(container);
root.render(<Location />);
