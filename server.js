//////////////////////////

// app.js

const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors"); // Import cors package
const Routes = require("./Routes");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());

// Use cors middleware
app.use(cors());

// Define Routes
// Add more routes as needed
app.use("/api/v1/", Routes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
