const express = require("express");
const app = express();
const PORT = 3000;

// Set up the default route
app.get("/", (req, res) => {
  res.send("The server is running successfully!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
