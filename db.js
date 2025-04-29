const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

// Initialize DB file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ entries: [] }));
}

function getDb() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

module.exports = {
  createEntry: (data, type) => {
    const db = getDb();
    const entry = {
      id: Date.now().toString(),
      data_type: type,
      content: data,
      created_at: new Date().toISOString(),
      access_count: 0
    };
    db.entries.push(entry);
    saveDb(db);
    return entry;
  },

  getEntry: (id) => {
    const db = getDb();
    return db.entries.find(entry => entry.id === id);
  },

  updateAccess: (id) => {
    const db = getDb();
    const entry = db.entries.find(entry => entry.id === id);
    if (entry) {
      entry.access_count += 1;
      entry.last_accessed = new Date().toISOString();
      saveDb(db);
    }
    return entry;
  }
};
