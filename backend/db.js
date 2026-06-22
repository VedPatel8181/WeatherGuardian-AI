const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'weather_guardian.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Initialize tables
            db.serialize(() => {
                // Drop table to ensure new Ahmedabad data is seeded
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
                stmt.run("Sardar Patel Stadium Shelter", 23.0898, 72.5802, 500, 120, "Water, First Aid, Beds, Power backup");
                stmt.run("Ahmedabad Town Hall Safehouse", 23.0267, 72.5695, 200, 50, "Water, Blankets, Food packets");
                stmt.run("Gujarat University Convention Centre", 23.0374, 72.5519, 1000, 850, "Medical Team, Food, Blankets, Tents");
                stmt.run("Maninagar Community Hall", 22.9984, 72.6026, 300, 95, "Water, Emergency Kits, Blankets");
                stmt.run("Sabarmati Riverfront Rescue Camp", 23.0485, 72.5723, 800, 320, "Boats, Lifejackets, First Aid, Food");
                stmt.finalize();
            });
    }
});

module.exports = db;
