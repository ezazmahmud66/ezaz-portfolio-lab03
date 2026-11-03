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
// Login Page
// ================================

app.get("/login", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "login.html"
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


            name =
                name.trim();

            email =
                email
                    .trim()
                    .toLowerCase();


            if (name.length < 2) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Please enter a valid name."
                });

            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Please enter a valid email address."
                });

            }


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


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    12
                );


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
// Login API
// ================================

app.post(
    "/api/login",
    async (req, res) => {

        try {

            let {
                email,
                password
            } = req.body;


            // Required fields

            if (
                !email ||
                !password
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Email and password are required."
                });

            }


            email =
                email
                    .trim()
                    .toLowerCase();


            // Find user by email

            const user =
                db.prepare(`
                    SELECT
                        id,
                        name,
                        email,
                        password
                    FROM users
                    WHERE email = ?
                `)
                .get(email);


            // Do not reveal whether
            // email or password was wrong

            if (!user) {

                return res.status(401).json({
                    success: false,
                    message:
                        "Incorrect email or password."
                });

            }


            // Compare entered password
            // with hashed password

            const passwordMatches =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!passwordMatches) {

                return res.status(401).json({
                    success: false,
                    message:
                        "Incorrect email or password."
                });

            }


            console.log(
                `Login successful for user ID: ${user.id}`
            );


            return res.status(200).json({

                success: true,

                message:
                    "Login successful.",

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }

            });


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            return res.status(500).json({
                success: false,
                message:
                    "Something went wrong while logging in."
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
            ` Login:`
        );

        console.log(
            ` http://localhost:${PORT}/login`
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