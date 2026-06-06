// packages/backend/server.js

import dotenv from "dotenv";
import express from "express";
import sql from "./access_db.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "./hashing.js";

dotenv.config();

const API_URL = import.meta.env.BACKEND_URL;

const app = express();
const port = 8000;
const allowedOrigins = [
    `http://localhost:5173`,
    API_URL
];

function generateAccessToken(user) {
    const secret = process.env.SECRET_TOKEN
    return jwt.sign(
        {id: user},
        secret,
        {expiresIn: "1d"}
    );
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

app.listen(port, () => 
    console.log("App listening at http://localhost:" + port));

app.get("/", (req, res) => {
    res.send("Welcome to the GardenGuru API!");
});

// === USERS ENDPOINTS ===
app.get("/users", async (req, res) => {
    try {
        const users = await sql`SELECT * FROM users`;
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/users/:id", async (req, res) => {
    const userId = req.params;
    try {
        const users = await sql`
            SELECT * FROM users 
            WHERE id = ${userId}
        `;
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


// updates user information
app.post("/update", async (req, res) => {
    const { id, name, email, password } = req.body

    try {
        const hashedPassword = await hashPassword(password);

        const data = await sql`
            UPDATE users
            SET name = ${name}, email = ${email}, password = ${hashedPassword}
            WHERE id = ${id}
        `;

        console.log("Updated user: ", name)
        res.json(data)
    }
    catch (err) {
        res.status(500).json({message: "Server error"});
    }
});

// gets user information only meant to be seen by same user
app.get("/profile", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({message: "No token provided"})
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN)
        const data = await sql`
            SELECT *
            FROM users
            WHERE id = ${decoded.id}
        `;
        
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.json(data[0])
    }
    catch (err) {
        console.error("Profile route error:", err);

        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        return res.status(500).json(err);
    }
});

// removes a user and their favorites
app.delete("/users", async (req, res) => {

    const authHeader = req.headers.authorization;
    const { user_id } = req.body;

    if (!authHeader) {
        return res.status(401).json({message: "No token provided"})
    }
    
    try {
        const favs = await sql`
            SELECT f.id FROM favorites f
            JOIN user_favorites_list ufl ON f.id = ufl.favorites_id
            WHERE ufl.user_id = ${user_id}
        `;
        
        await sql`
            DELETE FROM users 
            WHERE id = ${user_id}
        `;

        for (let i = 0; i < favs.length; i++) {
            await sql`
                DELETE FROM favorites 
                WHERE id = ${favs[i].id}
            `;

            await sql`
                DELETE FROM user_favorites_list 
                WHERE favorites_id = ${favs[i].id} 
                AND user_id = ${user_id}
            `;
        }

        res.json({message: "User removed successfully"});
    }
    catch (err) {
        console.log(err);
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

        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const token = generateAccessToken(user.id);

        res.json({token})
    } 
    catch (err) {
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

        const hashedPassword = await hashPassword(password);

        await sql`
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${email}, ${hashedPassword})
        `;

        const newUser = await sql`
            SELECT id FROM users
            WHERE name = ${name} 
            AND email = ${email} 
            AND password = ${hashedPassword}
            ORDER BY id DESC
            LIMIT 1
        `

        const token = generateAccessToken(newUser.id);

        res.json({token});
    } 
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// changes the password of the current user
app.post("/password", async (req, res) => {
    const { email, newPwd, retypedPwd } = req.body;
    
    if (newPwd != retypedPwd) {
        return res.status(403).json({ message: "Passwords must match "});
    }
    
    try {
        const users = await sql`
            SELECT * FROM users
            WHERE email = ${email} 
        `;

        if (users.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = users[0];
        const match = await comparePassword(newPwd, user.password);
        
        if (match) {
            return res.status(400).json({ message: "New password cannot be the same as old password" })
        }

        const hashedPassword = await hashPassword(newPwd);

        await sql`
            UPDATE users
            set password = ${hashedPassword}
            WHERE email = ${email}
        `;

        res.json({message: "Password successfully changed"})
    } 
    catch (err) {
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

        console.log(favorites);
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
app.post("/favorites", async (req, res) => {
    const { name, description, selectedPlants, user_id } = req.body;
    try {
        await sql`
        INSERT INTO favorites (
            name,
            description,
            plants
        )
        VALUES (
            ${name},
            ${description},
            ${selectedPlants}
        )
        `;

        await sql`
        INSERT INTO user_favorites_list (
            user_id,
            favorites_id
        )
        VALUES (
            ${user_id},
            (SELECT id FROM favorites 
            WHERE name = ${name} 
            AND description = ${description} 
            AND plants = ${selectedPlants} 
            ORDER BY id DESC 
            LIMIT 1)
        )
        `;

        res.json({message: "Favorite added successfully"});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: "Server error"});
    }
});

// removes a favorite list(s)
app.delete("/favorites", async (req, res) => {
    const { selectedToRemove, user_id } = req.body;
    
    try {
        for (const id of selectedToRemove) {
            await sql`
                DELETE FROM favorites 
                WHERE id = ${id}
            `;

            await sql`
                DELETE FROM user_favorites_list 
                WHERE user_id = ${user_id} 
                AND favorites_id = ${id}
            `;
        }

        res.json({message: "Favorite removed successfully"});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: "Server error"});
    }
});
