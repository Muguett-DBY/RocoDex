import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

function readUsers(): User[] {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users: User[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function findUserByUsername(username: string): User | undefined {
  const users = readUsers();
  return users.find((u) => u.username === username);
}

export function createUser(username: string, password: string): User {
  const users = readUsers();
  const user: User = {
    id: crypto.randomUUID(),
    username,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}
