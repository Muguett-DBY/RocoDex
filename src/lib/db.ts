import Database from "better-sqlite3";
import path from "node:path";

const dbPath = path.join(process.cwd(), "data", "rocodex.db");

const db = new Database(dbPath);

db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id        TEXT PRIMARY KEY,
    username  TEXT UNIQUE NOT NULL,
    password  TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export function findUserByUsername(username: string): User | undefined {
  return db.prepare("SELECT * FROM User WHERE username = ?").get(username) as User | undefined;
}

export function createUser(username: string, password: string): User {
  const id = crypto.randomUUID();
  db.prepare("INSERT INTO User (id, username, password) VALUES (?, ?, ?)").run(id, username, password);
  return { id, username, password, createdAt: new Date().toISOString() };
}

export { db };
