// packages/frontend/src/plant.jsx

import React, { useState, useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import { set, useForm } from "react-hook-form";
import Header from "./header.jsx";

function PlantTable(plant) {
    return (
        <>
        <div className="table-container">
            <h2>Nutritional Information</h2>
            <br></br>
            <table id="plant" border="1">
            <thead>
                <tr>
                    <th>Zones</th>
                    <th>Calories</th>
                    <th>Growth Time (days)</th>
                </tr>
            </thead>
            <tbody id="row-1"></tbody>
            <thead>
                <tr>
                    <th>Fat (g)</th>
                    <th>Carbs (g)</th>
                    <th>Fiber (g)</th>
                </tr>
            </thead>
            <tbody id="row-2"></tbody>
            <thead>
                <tr>
                    <th>Protein (g)</th>
                    <th>Sugars (g)</th>
                    <th>Potassium (mg)</th>
                </tr>
            </thead>
            <tbody id="row-3"></tbody>
            <thead>
                <tr>
                    <th>Magnesium (mg)</th>
                    <th>Calcium (mg)</th>
                    <th>Vitamin C (%)</th>
                </tr>
            </thead>
            <tbody id="row-4"></tbody>
            </table>
        </div>
        </>
    );
}

function Plant() {
    const [plant, setPlant] = useState(null);
    const [plant_img, setPlantImg] = useState(null);


    useEffect(() => {
        async function loadPlant() {

            // Fetches plant information based on what plant the user clicked
            const plant = localStorage.getItem("plantName");
            console.log("Rendering plant: ", plant);
            const res = await fetch(`/api/pages/${plant}`);

            if (res.status === 404) {
                console.error("Plant not found: ", plant);
                window.location.href = "/senior-project/index.html";
                return;
            }

            const data = await res.json();
            setPlant(data[0]);
            
            // Fetches nutritional information and image of the plant
            const dataRes = await fetch(`/api/plants/${plant}`);
            const dataPlant = await dataRes.json();
            setPlantImg(dataPlant[0].image);

            const table1 = document.querySelector("#plant #row-1");
            const table2 = document.querySelector("#plant #row-2");
            const table3 = document.querySelector("#plant #row-3");
            const table4 = document.querySelector("#plant #row-4");

            dataPlant.forEach(plant => {
                const row1 = document.createElement("tr");
                const row2 = document.createElement("tr");
                const row3 = document.createElement("tr");
                const row4 = document.createElement("tr");

                row1.innerHTML = `
                    <td>${plant.locations}</td>
                    <td>${plant.kcal}</td>
                    <td>${plant.growth_time}</td>
                `;
                table1.appendChild(row1);

                row2.innerHTML = `
                    <td>${plant.fat}</td>
                    <td>${plant.carbohydrates}</td>
                    <td>${plant.fiber}</td>
                `;
                table2.appendChild(row2);

                row3.innerHTML = `
                    <td>${plant.protein}</td>
                    <td>${plant.sugars}</td>
                    <td>${plant.potassium}</td>
                `;
                table3.appendChild(row3);

                row4.innerHTML = `
                    <td>${plant.magnesium}</td>
                    <td>${plant.calcium}</td>
                    <td>${plant.vitamin_c}</td>
                `;
                table4.appendChild(row4);
            });
        }

        loadPlant();
    }, []);

    if (!plant) {
        return <>Loading..</>; 
    }

    return (
        <>
            <Header />
            <div className="middle">
            <h1 className="plant-title">{plant.name}</h1>
            <div className="description">
                <img className="photo-info" src={plant_img} alt={`${plant.name}`} />
                {PlantTable(plant)}
            </div>
            <h2>Description</h2>
            <div className="description">
                <p>{plant.description}</p>
                <img className="info" src={plant.description_img} alt={`${plant.name} description`} />
            </div>
            <h2>How to Grow</h2>
            <div className="description">
                <img className="info" src={plant.how_img} alt={`Growing ${plant.name}`} />
                <p>{plant.how}</p>
            </div>
            <h2>Harvesting</h2>
            <div className="description">
                <p>{plant.harvesting}</p>
                <img className="info" src={plant.harvesting_img} alt={`Harvesting ${plant.name}`} />
            </div>
            <h2>Fun Fact</h2>
            <div className="description">
                <p>{plant.fact}</p>
            </div>
            </div>
            <div className="bottom">
                <a href="/senior-project/src/about.html"><h1>About Us</h1></a>
            </div>
        </>
    );
}

const container = document.getElementById("plant-root");
const root = ReactDOMClient.createRoot(container);
root.render(<Plant />);
