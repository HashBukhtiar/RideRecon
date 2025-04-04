// server/server.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Test endpoint for verifying that the server is running
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// API endpoint for car identification
app.post('/api/identify', (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Image data is required" });
  }
  res.json({
    make: "Toyota",
    model: "Corolla",
    confidence: "95%",
    "4o-make": "Toyota",
    "4o-model": "Corolla",
    "gemini-make": "Toyota",
    "gemini-model": "Corolla",
    "ris-make": "Toyota",
    "ris-model": "Corolla",
    fact: "Did you know Toyota is one of the largest manufacturers in the world?",
    source: [
      "https://www.autotrader.com",
      "https://www.cars.com",
      "https://www.cargurus.com"
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
