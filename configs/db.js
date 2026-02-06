const Database = require("better-sqlite3");

// ouverture / création du fichier
const db = new Database("./bd");

// activer clés étrangères
db.pragma("foreign_keys = ON");


module.exports = {db};
