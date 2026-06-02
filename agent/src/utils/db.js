import Database from "better-sqlite3";

const db = new Database("./data/embeddings.db");

db.exec(`
CREATE TABLE IF NOT EXISTS files (
    path TEXT PRIMARY KEY,
    content TEXT,
    embedding TEXT
)
`);

export default db;