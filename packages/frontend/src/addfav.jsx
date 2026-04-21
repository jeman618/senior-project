import React, {useState, useEffect} from "react";
import ReactDOMClient from "react-dom/client";
import { useForm } from "react-hook-form";
import Header from "./header.jsx";

function isTokenValid(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch (err) {
        return false;
    }
}

function redirectToLogin() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

function AddFav() {
    const {
            register,
            handleSubmit,
            watch,
            setValue,
            formState: { errors },
        } = useForm({
            defaultValues: {
                name: "",
                description: "",
                selectedPlants: []
            }
        });

    const [favError, setFavError] = useState();
    const title = watch("title");
    const description = watch("description");
    const [selectedPlants, setSelectedPlants] = useState([]);
    const [showSelectedPlants, setShowSelectedPlants] = useState([]);
    const [plants, setPlants] = useState([]);

    const addPlantToList = (plant) => {
        const updatedPlants = [...selectedPlants, plant];
        setSelectedPlants(updatedPlants);
        setValue("selectedPlants", updatedPlants, { shouldValidate: true });
    };

    function removePlantFromList(plant) {
        if (!selectedPlants) {
            return "";
        }
        const plantsArray = selectedPlants.split(",").map(p => p.trim());
        const updatedPlants = plantsArray.filter(p => p !== plant);
        return updatedPlants.join(", ");
    }

    async function getPlants() {
            try {
                const res = await fetch("http://localhost:8000/plants");
                const plants = await res.json();

                setPlants(plants);
            }
            catch (err) {
                console.error("Failed to load plants: ", err);
            }
        }

    function PlantMenu() {
        return (
        <>
        <div className="button">
        <div className="dropdown">
            <h1>▼</h1>
            <div className="dropdown-content">
                {plants.map((plant) => (
                <p key={plant.id} onClick={() => addPlantToList(plant)}>
                    {plant.name}
                </p>
            ))}
            </div>
            {errors.selectedPlants && <span style={{ color: "red" }}>{errors.selectedPlants.message}</span>}
        </div>
        </div>
        </>
        );
    }

    const onSubmit = async (data) => {
        setFavError("");
        try {
            const token = localStorage.getItem("token");
            if (!token || !isTokenValid(token)) {
                redirectToLogin();
                return;
            }

            const user_res = await fetch("http://localhost:8000/users/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const user_data = await user_res.json();
            const userId = user_data.id;
            const names = selectedPlants.map(p => p.name);

            const finalData = {
                ...data,
                selectedPlants: names
            };

            const res = await fetch("http://localhost:8000/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...finalData, user_id: userId}),
            });

            if (!res.ok) {
                setFavError("Could not add favorite");
                console.error("Failed to add favorite: ", res.statusText);
                return;
            }

            if (res.status === 200) {
                window.location.href = "user.html";
            }
        }
        catch (err) {
            setFavError("An error occurred while adding favorite");
            console.error("An error occurred while adding favorite: ", err);
        }
    }

    useEffect(() => {
        getPlants();
        if ((title || description || selectedPlants) && setFavError) {
            setFavError("");
        }
    }, [title, description, selectedPlants]);

    return (
        <>
        <Header />
        <div className="middle">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1 style={{ color: "black" }}>Title</h1>
                <input 
                type="text"
                className="fav_text"
                {...register("name", { required: true })}
                placeholder="Enter title..." 
                />
                {errors.name && <span style={{ color: "red" }}>{errors.name.message}</span>}

                <h1 style={{ color: "black" }}>Description</h1>
                <textarea 
                {...register("description", { required: true })}
                className="fav_text" 
                placeholder="Describe your favorite plants..." 
                rows="10">
                </textarea>
                {errors.description && <span style={{ color: "red" }}>{errors.name.message}</span>}

                <h1 style={{ color: "black" }}>Select Plants</h1>
                <div className="featured">
                    {selectedPlants.map((plant, index) => (
                    <div key={index} className="featured-img">
                        <h3>{plant.name}</h3>
                        <img src={plant.image} alt={plant.name} />
                    </div>
                ))}
                </div>
                <PlantMenu />
                
                {favError && <span style={{ color: "red" }}>{favError}</span>}
                
                <input type="submit" className="loginBtn" value="Add" />
            </form>
            <a href="/src/user.html"><button className="fav-btn">Cancel</button></a>
        </div>
        </>
    );
}

const container = document.getElementById("addfav_root");
const root = ReactDOMClient.createRoot(container);
root.render(<AddFav />);