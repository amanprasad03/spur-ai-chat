import Database from "better-sqlite3";
import { readFileSync } from "fs";
import path from "path";
import fs from "fs";

const dataDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
// Open database file
const db = new Database(path.join(__dirname, "../../data/chat.db"), {
  verbose: console.log,
});

// Run schema on startup
const schemaPath = path.join(__dirname, "schema.sql");
const schema = readFileSync(schemaPath, "utf-8");
db.exec(schema);

export default db;
