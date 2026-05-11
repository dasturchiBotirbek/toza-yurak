"use strict";

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "app.db");

function migrate(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id TEXT UNIQUE,
      username TEXT NOT NULL DEFAULT '',
      full_name TEXT NOT NULL DEFAULT '',
      avatar_letter TEXT NOT NULL DEFAULT 'U',
      ref_code TEXT NOT NULL UNIQUE,
      balance_total REAL NOT NULL DEFAULT 0,
      team_total INTEGER NOT NULL DEFAULT 0,
      direct_refs INTEGER NOT NULL DEFAULT 0,
      active_marketing INTEGER NOT NULL DEFAULT 0,
      partner_teams INTEGER NOT NULL DEFAULT 0,
      partner_in_marketing INTEGER NOT NULL DEFAULT 0,
      level_num INTEGER NOT NULL DEFAULT 0,
      level_label TEXT NOT NULL DEFAULT '',
      level_subtitle TEXT NOT NULL DEFAULT '',
      level_meta TEXT NOT NULL DEFAULT '',
      joined_at TEXT NOT NULL DEFAULT '',
      in_marketing_structure INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'completed',
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      recipient TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      from_name TEXT NOT NULL DEFAULT '',
      date_str TEXT NOT NULL DEFAULT '',
      has_attachment INTEGER NOT NULL DEFAULT 0,
      plain_text TEXT NOT NULL DEFAULT '',
      image_file TEXT,
      language TEXT NOT NULL DEFAULT 'ru',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_tx_user ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_tx_created ON transactions(created_at);
    CREATE INDEX IF NOT EXISTS idx_tx_user_status ON transactions(user_id, status);
    CREATE INDEX IF NOT EXISTS idx_sessions_exp ON sessions(expires_at);
  `);

    let userCols = db.prepare("PRAGMA table_info(users)").all();
    const hasRefBy = userCols.some(function (c) {
        return c.name === "referred_by_user_id";
    });
    if (!hasRefBy) {
        db.exec(`ALTER TABLE users ADD COLUMN referred_by_user_id INTEGER REFERENCES users(id)`);
    }
    userCols = db.prepare("PRAGMA table_info(users)").all();
    const hasBizcard = userCols.some(function (c) {
        return c.name === "bizcard_json";
    });
    if (!hasBizcard) {
        db.exec(`ALTER TABLE users ADD COLUMN bizcard_json TEXT`);
    }
}

function seed(db) {
    const row = db.prepare("SELECT COUNT(*) AS c FROM users").get();
    if (row.c > 0) return;

    const insUser = db.prepare(`
    INSERT INTO users (
      username, full_name, avatar_letter, ref_code,
      balance_total, team_total, direct_refs, active_marketing,
      partner_teams, partner_in_marketing,
      level_num, level_label, level_subtitle, level_meta,
      joined_at, in_marketing_structure
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

    insUser.run(
        "dasturchi_Botirbek",
        "Botirbek Ibragimov",
        "B",
        "9826",
        600.75,
        24,
        5,
        8,
        3,
        6,
        2,
        "Уровень 2",
        "Участник маркетинговой программы",
        "Продолжайте приглашать партнёров для роста дохода.",
        "2026-05-07",
        1
    );

    const uid = db.prepare("SELECT id FROM users WHERE ref_code = ?").get("9826").id;
    const insTx = db.prepare(`
    INSERT INTO transactions (user_id, type, amount, status, description, created_at)
    VALUES (?,?,?,?,?,datetime('now', ?))
  `);

    const samples = [
        ["referral", 120.5, "completed", "Бонус за партнёра", "-2 days"],
        ["team", 340.0, "completed", "Командное вознаграждение", "-5 days"],
        ["bonus", 50.0, "completed", "Акция недели", "-8 days"],
        ["referral", 200.0, "pending", "Ожидает подтверждения", "-1 days"],
        ["team", 90.25, "completed", "Уровень 2 — выплата", "-12 hours"]
    ];
    samples.forEach(function (s) {
        insTx.run(uid, s[0], s[1], s[2], s[3], s[4]);
    });
}

function openDatabase() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    db.pragma("busy_timeout = 5000");
    migrate(db);
    seed(db);
    return db;
}

module.exports = { openDatabase, DATA_DIR };
