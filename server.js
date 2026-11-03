const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");

// Initialize database
const db = require("./database/db");

const app = express();

const PORT = process.env.PORT || 3000;


// ================================
// Middleware
// ================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// Serve frontend files
app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


// ================================
// Home Route
// ================================

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
// Registration Page
// ================================

app.get("/register", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "register.html"
        )
    );

});


// ================================
// Registration API
// ================================

app.post(
    "/api/register",
    async (req, res) => {

        try {

            let {
                name,
                email,
                password,
                confirmPassword
            } = req.body;


            // ================================
            // Required Fields
            // ================================

            if (
                !name ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "All fields are required."
                });

            }


            // Clean values

            name =
                name.trim();

            email =
                email
                    .trim()
                    .toLowerCase();


            // ================================
            // Name Validation
            // ================================

            if (name.length < 2) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Please enter a valid name."
                });

            }


            // ================================
            // Email Validation
            // ================================

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Please enter a valid email address."
                });

            }


            // ================================
            // Password Validation
            // ================================

            if (password.length < 6) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Password must contain at least 6 characters."
                });

            }


            if (
                password !==
                confirmPassword
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Passwords do not match."
                });

            }


            // ================================
            // Duplicate Email Check
            // ================================

            const existingUser =
                db.prepare(`
                    SELECT id
                    FROM users
                    WHERE email = ?
                `)
                .get(email);


            if (existingUser) {

                return res.status(409).json({
                    success: false,
                    message:
                        "An account already exists with this email address."
                });

            }


            // ================================
            // Hash Password
            // ================================

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    12
                );


            // ================================
            // Save User
            // ================================

            const insertUser =
                db.prepare(`
                    INSERT INTO users (
                        name,
                        email,
                        password
                    )
                    VALUES (?, ?, ?)
                `);


            const result =
                insertUser.run(
                    name,
                    email,
                    hashedPassword
                );


            console.log(
                `New user registered. ID: ${result.lastInsertRowid}`
            );


            return res.status(201).json({
                success: true,
                message:
                    "Registration successful. Your account has been created."
            });


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            // Extra protection against
            // database UNIQUE constraint error

            if (
                error.code ===
                "SQLITE_CONSTRAINT_UNIQUE"
            ) {

                return res.status(409).json({
                    success: false,
                    message:
                        "An account already exists with this email address."
                });

            }


            return res.status(500).json({
                success: false,
                message:
                    "Something went wrong while creating your account."
            });

        }

    }
);


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
// Database Test
// ================================

app.get(
    "/database-test",
    (req, res) => {

        try {

            const usersTable =
                db.prepare(`
                    SELECT name
                    FROM sqlite_master
                    WHERE type = 'table'
                    AND name = 'users'
                `)
                .get();


            const resumeTable =
                db.prepare(`
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

    }
);


// ================================
// 404 Handler
// ================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message:
            "Page not found."
    });

});


// ================================
// Start Server
// ================================

app.listen(
    PORT,
    () => {

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
            ` Portfolio:`
        );

        console.log(
            ` http://localhost:${PORT}`
        );

        console.log("");

        console.log(
            ` Registration:`
        );

        console.log(
            ` http://localhost:${PORT}/register`
        );

        console.log("");

        console.log(
            ` Database Test:`
        );

        console.log(
            ` http://localhost:${PORT}/database-test`
        );

        console.log(
            "======================================"
        );

        console.log("");

    }
);