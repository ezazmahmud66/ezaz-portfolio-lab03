const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// ================================
// Middleware
// ================================

// Allow JSON request bodies
app.use(express.json());

// Allow HTML form data
app.use(express.urlencoded({ extended: true }));

// Serve frontend files from public folder
app.use(express.static(path.join(__dirname, "public")));

// ================================
// Routes
// ================================

// Home Route
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

// Server Health Check
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Lab 03 server is running successfully."
    });
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
    console.log("======================================");
    console.log(" Lab 03 Portfolio Server");
    console.log("======================================");
    console.log(` Server running at:`);
    console.log(` http://localhost:${PORT}`);
    console.log("");
    console.log(` Health check:`);
    console.log(` http://localhost:${PORT}/health`);
    console.log("======================================");
    console.log("");
});