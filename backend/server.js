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

// Get all alerts
app.get('/api/alerts', (req, res) => {
    db.all("SELECT * FROM alerts ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Broadcast a new alert
app.post('/api/alerts', (req, res) => {
    const { type, message } = req.body;
    if (!type || !message) {
        res.status(400).json({ error: "Type and Message are required." });
        return;
    }
    const stmt = db.prepare("INSERT INTO alerts (type, message) VALUES (?, ?)");
    stmt.run(type, message, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, type, message, timestamp: new Date().toISOString() });
    });
    stmt.finalize();
});

// Dismiss / Delete an alert
app.delete('/api/alerts/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM alerts WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Alert deleted successfully", changes: this.changes });
    });
});

// Get all drones
app.get('/api/drones', (req, res) => {
    db.all("SELECT * FROM drones", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Deploy a drone
app.post('/api/drones/:id/deploy', (req, res) => {
    const id = req.params.id;
    const { target } = req.body;
    if (!target) {
        res.status(400).json({ error: "Target is required." });
        return;
    }
    
    // Fetch current drone to verify it's Idle
    db.get("SELECT * FROM drones WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Drone not found." });
            return;
        }
        
        // Simulating battery consumption on deployment
        const newBattery = Math.max(10, row.battery - 20);
        db.run(
            "UPDATE drones SET status = 'Deployed', target = ?, battery = ? WHERE id = ?",
            [target, newBattery, id],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ id, status: 'Deployed', target, battery: newBattery });
            }
        );
    });
});

// Reset / Return a drone
app.post('/api/drones/:id/reset', (req, res) => {
    const id = req.params.id;
    db.run(
        "UPDATE drones SET status = 'Idle', target = '-', battery = 100 WHERE id = ?",
        [id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id, status: 'Idle', target: '-', battery: 100 });
        }
    );
});

// Update shelter occupancy
app.post('/api/shelters/:id/occupancy', (req, res) => {
    const id = req.params.id;
    const { occupancy } = req.body;
    if (occupancy === undefined) {
        res.status(400).json({ error: "Occupancy value is required." });
        return;
    }
    
    db.run(
        "UPDATE shelters SET occupancy = ? WHERE id = ?",
        [occupancy, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id, occupancy, changes: this.changes });
        }
    );
});

// Dispatch supply directly to shelter
app.post('/api/shelters/:id/dispatch', (req, res) => {
    const id = req.params.id;
    const { supplyType } = req.body;
    if (!supplyType) {
        res.status(400).json({ error: "Supply type is required." });
        return;
    }

    db.get("SELECT facilities FROM shelters WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Shelter not found." });
            return;
        }

        let currentFacilities = row.facilities || "";
        if (!currentFacilities.toLowerCase().includes(supplyType.toLowerCase())) {
            currentFacilities = currentFacilities ? `${currentFacilities}, Extra ${supplyType}` : `Extra ${supplyType}`;
        }

        db.run(
            "UPDATE shelters SET facilities = ? WHERE id = ?",
            [currentFacilities, id],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ id, facilities: currentFacilities, message: `${supplyType} dispatched successfully.` });
            }
        );
    });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
