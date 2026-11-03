const express = require("express");
const path = require("path");

// Initialize database
const db = require("./database/db");

const app = express();

const PORT = process.env.PORT || 3000;

// ================================
// Middleware
// ================================

// Allow JSON request bodies
app.use(express.json());

// Allow HTML form data
app.use(
    express.urlencoded({
        extended: true
    })
);

// Serve frontend files
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// ================================
// Routes
// ================================

// Home Route
app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
});

// ================================
// Health Check
// ================================

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message:
            "Lab 03 server is running successfully."
    });
});

// ================================
// Database Test Route
// ================================

app.get("/database-test", (req, res) => {
    try {

        const usersTable = db
            .prepare(`
                SELECT name
                FROM sqlite_master
                WHERE type = 'table'
                AND name = 'users'
            `)
            .get();

        const resumeTable = db
            .prepare(`
                SELECT name
                FROM sqlite_master
                WHERE type = 'table'
                AND name = 'resume_data'
            `)
            .get();

        res.json({
            success: true,

            database:
                "SQLite connected successfully.",

            usersTable:
                usersTable
                    ? "users table exists"
                    : "users table missing",

            resumeTable:
                resumeTable
                    ? "resume_data table exists"
                    : "resume_data table missing"
        });

    } catch (error) {

        console.error(
            "Database test error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Database connection failed."
        });
    }
});

// ================================
// 404 Handler
// ================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Page not found."
    });
});

// ================================
// Start Server
// ================================

app.listen(PORT, () => {

    console.log("");

    console.log(
        "======================================"
    );

    console.log(
        " Lab 03 Portfolio Server"
    );

    console.log(
        "======================================"
    );

    console.log(
        ` Server running at:`
    );

    console.log(
        ` http://localhost:${PORT}`
    );

    console.log("");

    console.log(
        ` Health check:`
    );

    console.log(
        ` http://localhost:${PORT}/health`
    );

    console.log("");

    console.log(
        ` Database test:`
    );

    console.log(
        ` http://localhost:${PORT}/database-test`
    );

    console.log(
        "======================================"
    );

    console.log("");
});