import { Redis } from "@upstash/redis";
import fs from "node:fs";
import path from "node:path";

// Use Upstash Redis in production, JSON file in development
const useRedis = !!(process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN);

const redis = useRedis ? new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
}) : null;

// Local fallback storage
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

function readLocalUsers(): User[] {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeLocalUsers(users: User[]): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

function userKey(username: string) {
  return `user:${username}`;
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
  if (useRedis && redis) {
    return (await redis.get(userKey(username))) as User | undefined;
  }
  return readLocalUsers().find((u) => u.username === username);
}

export async function createUser(username: string, password: string): Promise<User> {
  const user: User = { id: crypto.randomUUID(), username, password, createdAt: new Date().toISOString() };

  if (useRedis && redis) {
    await redis.set(userKey(username), user);
  } else {
    const users = readLocalUsers();
    users.push(user);
    writeLocalUsers(users);
  }

  return user;
}
