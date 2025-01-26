// Import required modules
const express = require("express");

// Create an Express application
const app = express();

// Define routes
app.get("/", (req, res) => {
  res.send("Property CRM at your service!");
});

// Start the server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
