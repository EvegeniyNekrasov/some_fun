require("dotenv").config();

const express = require("express");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 6969;
const JWT_SECRET = process.env.JWT_SECRET || "cubatadelejia";
const db = new Database("./database.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'open',
        priority TEXT DEFAULT 'medium',
        user_id INTEGER NOT NULL,
        assignee_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TRIGGER IF NOT EXISTS tickets_update_timestamp
    AFTER UPDATE ON tickets
    BEGIN
    UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(ticket_id) REFERENCES tickets(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
`);

app.use(cors());
app.use(express.json());

function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "8h" }
    );
}

function requireAuth(role = null) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.split(" ")[1];

        if (!token) return res.status(401).json({ error: "Token missing" });

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (role && decoded.role !== role)
                return res.status(403).json({ error: "Forbiden" });

            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ error: "Invalid token" });
        }
    };
}

app.post("/api/register", (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ error: "Missing fields" });

    try {
        const hash = bcrypt.hashSync(password, 10);
        const stmt = db.prepare(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)"
        );
        const info = stmt.run(username, email, hash, role || "user");
        const user = {
            id: info.lastInsertRowid,
            username,
            role: role || "user",
        };
        res.status(201).json({ token: generateToken(user) });
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res
                .status(409)
                .json({ error: "Username or email already exists" });
        }

        res.status(500).json({ error: "Database error" });
    }
});

app.listen(PORT, () =>
    console.log(`Server listening on: http://localhost:${PORT}`)
);
