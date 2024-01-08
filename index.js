const express = require('express');
const axios = require('axios'); // Install the axios library if you haven't (npm install axios)
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Route to handle the index.php functionality
app.get('/index.php', async (req, res) => {
  try {
    const loggerID = req.query.loggerID;

    // Simulate log.js data
    const userData = { ip: '127.0.0.1', time: new Date(), userAgent: req.get('User-Agent') };

    // Send user data to server.js
    const response = await axios.get(`http://localhost:3000/server.js/logger.php`, {
      params: {
        loggerID: loggerID,
        userData: JSON.stringify(userData)
      }
    });

    // Retrieve redirect link from server
    const redirectLink = response.data.redirectLink;

    // Redirect the user
    res.redirect(redirectLink);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
