
using Microsoft.Data.Sqlite;

namespace server_net;

public static class SeedData
{
    public static void NewData(SqliteConnection conn)
    {
        conn.Open();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS Products (
                Id      INTEGER PRIMARY KEY AUTOINCREMENT,
                Name    TEXT NOT NULL,
                Price   REAL NOT NULL
            );

            CREATE TABLE IF NOT EXISTS users(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user TEXT UNIQUE NOT NULL,
                username TEXT NOT NULL,
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
        ";
        cmd.ExecuteNonQuery();
    }
}
