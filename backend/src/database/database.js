import Database from 'better-sqlite3';
import path from 'node:path';

const dbFile = process.env.DB_FILE;

const dbPath = path.resolve(process.cwd(), dbFile);
export const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

