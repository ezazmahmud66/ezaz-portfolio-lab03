const Database = require("better-sqlite3");
const path = require("path");

const databasePath = path.join(
    __dirname,
    "database.db"
);

const db = new Database(databasePath);

// Enable foreign key support
db.pragma("foreign_keys = ON");

// ================================
// Create Users Table
// ================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

// ================================
// Create Resume Data Table
// ================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS resume_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id INTEGER NOT NULL UNIQUE,

        full_name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,

        objective TEXT,

        education TEXT,
        skills TEXT,
        experience TEXT,
        projects TEXT,
        certifications TEXT,

        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
    )
`).run();

console.log(
    "SQLite database initialized successfully."
);

module.exports = db;