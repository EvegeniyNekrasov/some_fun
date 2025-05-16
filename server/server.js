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

db.pragma("foreign_keys=ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS projects(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        owner_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS statuses(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        category TEXT CHECK(category IN('todo','inprogress','done')) NOT NULL,
        color TEXT DEFAULT '#2684FF'
    );

    CREATE TABLE IF NOT EXISTS issue_types(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        icon TEXT
    );
    
    INSERT OR IGNORE INTO statuses(id,name,category) VALUES
    (1,'To Do','todo'),
    (2,'In Progress','inprogress'),
    (3,'Done','done');

    INSERT OR IGNORE INTO issue_types(id,name) VALUES
    (1,'Task'),
    (2,'Bug'),
    (3,'Story');
    
    CREATE TABLE IF NOT EXISTS tickets(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        type_id INTEGER NOT NULL DEFAULT 1,
        title TEXT NOT NULL,
        description TEXT,
        status_id INTEGER NOT NULL DEFAULT 1,
        priority TEXT DEFAULT 'medium',
        user_id INTEGER NOT NULL,
        assignee_id INTEGER,
        story_points REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(project_id) REFERENCES projects(id),
        FOREIGN KEY(type_id) REFERENCES issue_types(id),
        FOREIGN KEY(status_id) REFERENCES statuses(id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(assignee_id) REFERENCES users(id)
    );

    CREATE TRIGGER IF NOT EXISTS tickets_update_timestamp
    AFTER UPDATE ON tickets
    BEGIN
    UPDATE tickets SET updated_at=CURRENT_TIMESTAMP WHERE id=NEW.id;
    END;

    CREATE TABLE IF NOT EXISTS comments(
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
function generateToken(u) {
    return jwt.sign(
        { id: u.id, username: u.username, role: u.role },
        JWT_SECRET,
        { expiresIn: "8h" }
    );
}
function requireAuth(role = null) {
    return (req, res, next) => {
        const h = req.headers.authorization || "";
        const t = h.split(" ")[1];
        if (!t) return res.status(401).json({ error: "Token missing" });
        try {
            const d = jwt.verify(t, JWT_SECRET);
            if (role && d.role !== role)
                return res.status(403).json({ error: "Forbidden" });
            req.user = d;
            next();
        } catch {
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
            "INSERT INTO users(username,email,password,role)VALUES(?,?,?,?)"
        );
        const info = stmt.run(username, email, hash, role || "user");
        res.status(201).json({
            token: generateToken({
                id: info.lastInsertRowid,
                username,
                role: role || "user",
            }),
        });
    } catch (e) {
        if (e.code === "SQLITE_CONSTRAINT_UNIQUE")
            return res
                .status(409)
                .json({ error: "Username or email already exists" });
        res.status(500).json({ error: "Database error" });
    }
});
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: "Missing fields" });
    const u = db.prepare("SELECT * FROM users WHERE username=?").get(username);
    if (!u || !bcrypt.compareSync(password, u.password))
        return res.status(401).json({ error: "Invalid credentials" });
    res.json({ token: generateToken(u) });
});
app.get("/api/projects", requireAuth(), (req, res) => {
    const rows = db.prepare("SELECT * FROM projects").all();
    res.json(rows);
});
app.post("/api/projects", requireAuth(), (req, res) => {
    const { key, name, description } = req.body;
    if (!key || !name) return res.status(400).json({ error: "Missing fields" });
    const info = db
        .prepare(
            "INSERT INTO projects(key,name,description,owner_id)VALUES(?,?,?,?)"
        )
        .run(key, name, description || "", req.user.id);
    const p = db
        .prepare("SELECT * FROM projects WHERE id=?")
        .get(info.lastInsertRowid);
    res.status(201).json(p);
});
app.get("/api/projects/:id", requireAuth(), (req, res) => {
    const p = db
        .prepare("SELECT * FROM projects WHERE id=?")
        .get(req.params.id);
    if (!p) return res.status(404).json({ error: "Project not found" });
    res.json(p);
});
app.put("/api/projects/:id", requireAuth(), (req, res) => {
    const { key, name, description } = req.body;
    const p = db
        .prepare("SELECT * FROM projects WHERE id=?")
        .get(req.params.id);
    if (!p) return res.status(404).json({ error: "Project not found" });
    if (p.owner_id !== req.user.id && req.user.role !== "admin")
        return res.status(403).json({ error: "Forbidden" });
    db.prepare(
        "UPDATE projects SET key=COALESCE(?,key),name=COALESCE(?,name),description=COALESCE(?,description) WHERE id=?"
    ).run(key, name, description, req.params.id);
    res.json(
        db.prepare("SELECT * FROM projects WHERE id=?").get(req.params.id)
    );
});
app.delete("/api/projects/:id", requireAuth("admin"), (req, res) => {
    db.prepare("DELETE FROM projects WHERE id=?").run(req.params.id);
    res.status(204).send();
});
app.get("/api/statuses", requireAuth(), (req, res) => {
    res.json(db.prepare("SELECT * FROM statuses").all());
});
app.get("/api/issue-types", requireAuth(), (req, res) => {
    res.json(db.prepare("SELECT * FROM issue_types").all());
});
app.get("/api/tickets", requireAuth(), (req, res) => {
    const rows = db.prepare("SELECT * FROM tickets").all();
    res.json(rows);
});
app.get("/api/tickets/:id", requireAuth(), (req, res) => {
    const t = db.prepare("SELECT * FROM tickets WHERE id=?").get(req.params.id);
    if (!t) return res.status(404).json({ error: "Ticket not found" });
    res.json(t);
});
app.post("/api/tickets", requireAuth(), (req, res) => {
    const {
        project_id,
        type_id,
        title,
        description,
        priority,
        status_id,
        assignee_id,
        story_points,
    } = req.body;
    if (!project_id || !title)
        return res.status(400).json({ error: "Missing fields" });
    const info = db
        .prepare(
            "INSERT INTO tickets(project_id,type_id,title,description,priority,status_id,user_id,assignee_id,story_points)VALUES(?,?,?,?,?,?,?,?,?)"
        )
        .run(
            project_id,
            type_id || 1,
            title,
            description || "",
            priority || "medium",
            status_id || 1,
            req.user.id,
            assignee_id || null,
            story_points || null
        );
    const t = db
        .prepare("SELECT * FROM tickets WHERE id=?")
        .get(info.lastInsertRowid);
    res.status(201).json(t);
});
app.put("/api/tickets/:id", requireAuth(), (req, res) => {
    const {
        project_id,
        type_id,
        title,
        description,
        status_id,
        priority,
        assignee_id,
        story_points,
    } = req.body;
    const t = db.prepare("SELECT * FROM tickets WHERE id=?").get(req.params.id);
    if (!t) return res.status(404).json({ error: "Ticket not found" });
    if (t.user_id !== req.user.id && req.user.role !== "admin")
        return res.status(403).json({ error: "Forbidden" });
    db.prepare(
        `UPDATE tickets SET project_id=COALESCE(?,project_id),type_id=COALESCE(?,type_id),title=COALESCE(?,title),description=COALESCE(?,description),status_id=COALESCE(?,status_id),priority=COALESCE(?,priority),assignee_id=COALESCE(?,assignee_id),story_points=COALESCE(?,story_points) WHERE id=?`
    ).run(
        project_id,
        type_id,
        title,
        description,
        status_id,
        priority,
        assignee_id,
        story_points,
        req.params.id
    );
    res.json(db.prepare("SELECT * FROM tickets WHERE id=?").get(req.params.id));
});
app.delete("/api/tickets/:id", requireAuth(), (req, res) => {
    const t = db.prepare("SELECT * FROM tickets WHERE id=?").get(req.params.id);
    if (!t) return res.status(404).json({ error: "Ticket not found" });
    if (t.user_id !== req.user.id && req.user.role !== "admin")
        return res.status(403).json({ error: "Forbidden" });
    db.prepare("DELETE FROM comments WHERE ticket_id=?").run(req.params.id);
    db.prepare("DELETE FROM tickets WHERE id=?").run(req.params.id);
    res.status(204).send();
});
app.get("/api/tickets/:id/comments", requireAuth(), (req, res) => {
    res.json(
        db
            .prepare("SELECT * FROM comments WHERE ticket_id=?")
            .all(req.params.id)
    );
});
app.post("/api/tickets/:id/comments", requireAuth(), (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    const t = db.prepare("SELECT * FROM tickets WHERE id=?").get(req.params.id);
    if (!t) return res.status(404).json({ error: "Ticket not found" });
    const info = db
        .prepare("INSERT INTO comments(ticket_id,user_id,message)VALUES(?,?,?)")
        .run(req.params.id, req.user.id, message);
    res.status(201).json(
        db
            .prepare("SELECT * FROM comments WHERE id=?")
            .get(info.lastInsertRowid)
    );
});
app.listen(PORT, () => console.log("Server running on port " + PORT));
