const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'weather_guardian.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Initialize tables
        // Initialize tables
            db.serialize(() => {
                // Drop table to ensure new data is seeded
                db.run("DROP TABLE IF EXISTS shelters");
                
                db.run(`CREATE TABLE IF NOT EXISTS shelters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    lat REAL NOT NULL,
                    lng REAL NOT NULL,
                    capacity INTEGER,
                    occupancy INTEGER DEFAULT 0,
                    facilities TEXT
                )`);

                const stmt = db.prepare("INSERT INTO shelters (name, lat, lng, capacity, occupancy, facilities) VALUES (?, ?, ?, ?, ?, ?)");
                
                // Ahmedabad
                stmt.run("Sardar Patel Stadium Shelter (Ahmedabad)", 23.0898, 72.5802, 500, 120, "Water, First Aid, Beds, Power backup");
                stmt.run("Ahmedabad Town Hall Safehouse", 23.0267, 72.5695, 200, 50, "Water, Blankets, Food packets");
                stmt.run("Sabarmati Riverfront Rescue Camp", 23.0485, 72.5723, 800, 320, "Boats, Lifejackets, First Aid, Food");
                
                // Delhi
                stmt.run("Indira Gandhi Arena Shelter (Delhi)", 28.6290, 77.2514, 1200, 200, "Medical Camp, Water, Blankets, Food");
                stmt.run("Red Fort Ground Safehouse (Delhi)", 28.6562, 77.2410, 800, 150, "First Aid, Water, Power Backup");
                
                // Mumbai
                stmt.run("Dharavi Community Relief Camp (Mumbai)", 19.0380, 72.8538, 1500, 900, "Food, Water, Doctor on Call, Boats");
                stmt.run("Wankhede Rescue Shelter (Mumbai)", 18.9389, 72.8258, 600, 50, "Beds, Safe Water, Blankets");
                
                // Chennai
                stmt.run("Marina Beach Relief Centre (Chennai)", 13.0500, 80.2824, 1000, 450, "Boats, Lifejackets, Medical Team, Food");
                stmt.run("Jawaharlal Nehru Stadium Shelter (Chennai)", 13.0837, 80.2707, 2000, 300, "Water, Blankets, Charging stations");
                
                // Kolkata
                stmt.run("Eden Gardens Rescue Base (Kolkata)", 22.5646, 88.3433, 2500, 1100, "Water, Food packets, Tents, Medicines");
                stmt.run("Salt Lake Stadium Safehouse (Kolkata)", 22.5693, 88.4090, 3000, 500, "Doctors, Tents, Heavy Generator, Clothes");
                
                // Bengaluru
                stmt.run("Kanteerava Stadium Shelter (Bengaluru)", 12.9696, 77.5929, 1000, 100, "Beds, Clean Water, Sanitizers, First Aid");

                stmt.finalize();
            });
    }
});

module.exports = db;
