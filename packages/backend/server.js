// packages/backend/server.js

import express from "express";
import sql from "./access_db.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "./hashing.js";


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.listen(port, () => 
    console.log("App listening at http://localhost:" + port));

app.get("/", (req, res) => {
    res.send("Welcome to the GardenGuru API!");
});

// === USER ENDPOINTS ===
app.get("/users", async (req, res) => {
    try {
        const users = await sql`SELECT * FROM users`;
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// updates user information
app.post("/users/update", async (req, res) => {
    const { id, name, email, password } = req.body

    try {
        const hashedPassword = hashPassword(password);

        const data = await sql`
        UPDATE users
        SET name = ${name}, email = ${email}, password = ${hashedPassword}
        WHERE id = ${id}
        `
        console.log("Updated user: ", name)
        res.json(data)
    }
    catch (err) {
        res.status(500).json({message: "Server error"});
    }
});

// gets user information only meant to be seen by same user
app.get("/users/profile", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({message: "No token provided"})
    }

    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, "your_secret_key")
        const data = await sql`
        SELECT *
        FROM users
        WHERE id = ${decoded.id}
        `
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(data[0])
    }
    catch (err) {
        res.status(500).json({message: "Server error"});
    }
});

// logs user into account
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await sql`
            SELECT * FROM users
            WHERE email = ${email} 
        `;

        if (users.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = users[0];

        const match = comparePassword(password, user.password);

        if (!match) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const token = jwt.sign(
            {id: user.id},
            "your_secret_key",
            {expiresIn: "7200s"}
        )

        res.json({token})
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// signs up user
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const existingUsers = await sql`
            SELECT * FROM users
            WHERE email = ${email}
        `;

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = hashPassword(password);

        await sql`
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${email}, ${hashedPassword})
        `;

        const token = jwt.sign(
            {id: user.id},
            "your_secret_key",
            {expiresIn: "7200s"}
        )

        res.json({token});
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// === PLANTS ENDPOINTS ===
app.get("/plants", async (req, res) => {
    try {
        const plants = await sql`
            SELECT * FROM plants
        `;

        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// gets individual plant based on name
app.get("/plants/:name", async (req, res) => {
    const { name } = req.params;

    try {
        const plants = await sql`
            SELECT * FROM plants
            WHERE name = ${name}
        `;

        if (plants.length === 0) {
            return res.status(404).json({ message: "Plant not found" });
        }

        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// === PLANT PAGES ENDPOINTS ===
// gets plant information to make page
app.get("/pages/:name", async (req, res) => {
    const { name } = req.params;

    try {
        const plants = await sql`
            SELECT * FROM plant_pages
            WHERE name = ${name}
        `;

        if (plants.length === 0) {
            return res.status(404).json({ message: "Plant not found" });
        }

        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// === IMAGES ENDPOINTS ===
// gets image associated with plant

// === FAVORITES ENDPOINTS ===
app.get("/favorites", async (req, res) => {

    try {
        const favorites = await sql`
        SELECT * 
        FROM favorites
        `;

        if (favorites.length == 0) {
            return res.status(404).json({message : "Could not find favorites associated with user"})
        }

        res.json(favorites)
    }
    catch (err) {
        res.status(500).json({message: "Server error"});
    }
});

// gets favorites from an individual user
app.get("/favorites/:user_id", async (req, res) => {
    const { user_id } = req.params

    try {
        const favorites = await sql`
        SELECT f.* FROM favorites f
        JOIN user_favorites_list ufl ON f.id = ufl.favorites_id
        WHERE ufl.user_id = ${user_id}
        `;

        if (favorites.length == 0) {
            return res.status(404).json({message : "Could not find favorites associated with user"})
        }

        res.json(favorites)
    }
    catch (err) {
        res.status(500).json({message: "Server error"});
    }
});

// gets individual favorite
app.get("/favorite/:favorite_id", async (req, res) => {
    const { favorite_id } = req.params

    try {
        const favorites = await sql`
        SELECT * FROM favorites
        WHERE id = ${favorite_id}
        `;

        if (favorites.length == 0) {
            return res.status(404).json({message : "Could not find favorites associated with user"})
        }

        res.json(favorites)
    }
    catch (err) {
        res.status(500).json({message: "Server error"});
    }
});

// inserts new favorite (under construction)
app.post("/favorites/:data", async (req, res) => {
    const { data } = req.params

    try {
        await sql`
        INSERT INTO favorites (
            user_id,
            name,
            description,
            plants
        )
        VALUES (
            ${data.user_id},
            ${data.name},
            ${data.description},
            ${data.plants},
        )
        `;

        console.log("Inserted new favorite list: ", data)
        res.json(favorites)
    }
    catch (err) {
        res.status(500).json({message: "Server error"});
    }
});
