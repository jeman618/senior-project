import express from "express";
import sql from "./database.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", async (req, res) => {
    try {
        const users = await sql`
        SELECT * FROM users
        `;
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/user/:id", async (req, res) => {
    const { data } = req.params

    try {
        await sql`
        UPDATE users
        SET name = ${data.name}, email = ${data.email}, password = ${data.password}
        `

        console.log("Updated user: ", data)
        res.json(data)
    }
    catch (err) {
        res.status(500).json({message: "Server error"});
    }
});

app.get("/favorites/:user_id", async (req, res) => {
    const { user_id } = req.params

    try {
        const favorites = await sql`
        SELECT f.* FROM favorites f
        JOIN user_favorites_list ufl ON f.id = ufl.user_id
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

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await sql`
            SELECT * FROM users
            WHERE email = ${email} 
            AND password = ${password}
        `;

        if (users.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = users[0];

        if (user.password !== password) {
            return res.status(401).json({ message: "Wrong password" });
        }

        res.json({ message: "Login success", user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

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

        await sql`
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${email}, ${password})
        `;

        res.json({ message: "Signup success" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(port, () => 
    console.log("App listening at http://localhost:" + port));