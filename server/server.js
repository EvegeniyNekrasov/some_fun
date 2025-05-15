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

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: "Missing fields" });

    const user = db
        .prepare("SELECT * FROM users WHERE username = ?")
        .get(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ token: generateToken(user) });
});

app.get("/api/tickets", requireAuth(), (req, res) => {
    const tickets = db.prepare("SELECT * FROM tickets").all();
    res.json(tickets);
});

app.get("/api/tickets/:id", requireAuth(), (req, res) => {
    const ticket = db
        .prepare("SELECT * FROM tickets WHERE id = ?")
        .get(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
});

app.post("/api/tickets", requireAuth(), (req, res) => {
    const { title, description, priority } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const stmt = db.prepare(
        "INSERT INTO tickets (title, description, priority, user_id) VALUES (?, ?, ?, ?)"
    );
    const info = stmt.run(
        title,
        description || "",
        priority || "medium",
        req.user.id
    );
    const ticket = db
        .prepare("SELECT * FROM tickets WHERE id = ?")
        .get(info.lastInsertRowid);
    res.status(201).json(ticket);
});

app.put("/api/tickets/:id", requireAuth(), (req, res) => {
    const { title, description, status, priority, assignee_id } = req.body;
    const ticket = db
        .prepare("SELECT * FROM tickets WHERE id = ?")
        .get(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (ticket.user_id !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }

    const stmt = db.prepare(`
    UPDATE tickets SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      priority = COALESCE(?, priority),
      assignee_id = COALESCE(?, assignee_id)
    WHERE id = ?
  `);
    stmt.run(title, description, status, priority, assignee_id, req.params.id);
    const updated = db
        .prepare("SELECT * FROM tickets WHERE id = ?")
        .get(req.params.id);
    res.json(updated);
});

app.delete("/api/tickets/:id", requireAuth(), (req, res) => {
    const ticket = db
        .prepare("SELECT * FROM tickets WHERE id = ?")
        .get(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (ticket.user_id !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }

    db.prepare("DELETE FROM comments WHERE ticket_id = ?").run(req.params.id);
    db.prepare("DELETE FROM tickets WHERE id = ?").run(req.params.id);
    res.status(204).send();
});

app.get("/api/tickets/:id/comments", requireAuth(), (req, res) => {
    const comments = db
        .prepare("SELECT * FROM comments WHERE ticket_id = ?")
        .all(req.params.id);
    res.json(comments);
});

app.post("/api/tickets/:id/comments", requireAuth(), (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const ticket = db
        .prepare("SELECT * FROM tickets WHERE id = ?")
        .get(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const stmt = db.prepare(
        "INSERT INTO comments (ticket_id, user_id, message) VALUES (?, ?, ?)"
    );
    const info = stmt.run(req.params.id, req.user.id, message);
    const comment = db
        .prepare("SELECT * FROM comments WHERE id = ?")
        .get(info.lastInsertRowid);
    res.status(201).json(comment);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
