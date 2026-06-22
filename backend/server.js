const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'WeatherGuardian Backend' });
});

// Get all shelters
app.get('/api/shelters', (req, res) => {
    db.all("SELECT * FROM shelters", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
