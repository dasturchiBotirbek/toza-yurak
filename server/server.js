"use strict";

const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const os = require("os");
const path = require("path");

const config = require("./config");
config.assertProductionSafe();

const { openDatabase, DATA_DIR } = require("./db");
const { verifyWebAppInitData } = require("./telegramAuth");

const PORT = config.PORT;
const HOST = config.HOST;
const BOT_TOKEN = config.BOT_TOKEN;
const REFERRAL_BONUS_RAW = process.env.REFERRAL_BONUS_AMOUNT;
const REFERRAL_BONUS_AMOUNT =
    REFERRAL_BONUS_RAW === undefined || REFERRAL_BONUS_RAW === ""
        ? 50
        : Math.max(0, parseFloat(String(REFERRAL_BONUS_RAW).replace(",", ".")) || 0);
const ROOT = path.join(__dirname, "..");
const RECEIPT_IMG_DIR = path.join(DATA_DIR, "receipt_files");
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const BIZCARD_JSON_MAX_BYTES = 200000;

function parseUserBizcardJson(raw) {
    if (raw == null || String(raw).trim() === "") return null;
    try {
        const o = JSON.parse(String(raw));
        if (!o || typeof o !== "object" || Array.isArray(o)) return null;
        return o;
    } catch (e) {
        return null;
    }
}
const TELEGRAM_TEXT_MAX = 4096;

/**
 * Chek matni va (ixtiyoriy) rasmni foydalanuvchining Telegram chat_id ga yuboradi.
 * Mini App orqali kirgan akkauntda users.telegram_id to‘ldirilgan bo‘lishi kerak.
 */
async function telegramSendMessage(chatId, text) {
    if (!BOT_TOKEN) return { ok: false, reason: "no_token" };
    const cid = String(chatId || "").trim();
    if (!cid) return { ok: false, reason: "no_chat" };
    const safe = String(text || "").trim().slice(0, TELEGRAM_TEXT_MAX);
    if (!safe) return { ok: false, reason: "empty" };
    const url = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage";
    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: cid,
                text: safe,
                disable_web_page_preview: true
            })
        });
        const j = await r.json();
        if (j.ok) return { ok: true };
        console.warn("telegram sendMessage:", j.description || j);
        return { ok: false, reason: j.description || "telegram_api" };
    } catch (e) {
        console.warn("telegram sendMessage error:", e);
        return { ok: false, reason: "network" };
    }
}

async function telegramSendPhotoFromFile(chatId, absPath, caption) {
    if (!BOT_TOKEN) return { ok: false, reason: "no_token" };
    const cid = String(chatId || "").trim();
    if (!cid || !absPath || !fs.existsSync(absPath)) return { ok: false, reason: "skip" };
    const buf = fs.readFileSync(absPath);
    const ext = path.extname(absPath).toLowerCase();
    const mime =
        ext === ".png" ? "image/png" : ext === ".gif" ? "image/gif" : ext === ".webp" ? "image/webp" : "image/jpeg";
    const name = path.basename(absPath) || "receipt.jpg";
    const blob = new Blob([buf], { type: mime });
    const form = new FormData();
    form.set("chat_id", cid);
    form.append("photo", blob, name);
    if (caption) form.append("caption", String(caption).slice(0, 1024));
    const url = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendPhoto";
    try {
        const r = await fetch(url, { method: "POST", body: form });
        const j = await r.json();
        if (j.ok) return { ok: true };
        console.warn("telegram sendPhoto:", j.description || j);
        return { ok: false, reason: j.description || "telegram_api" };
    } catch (e2) {
        console.warn("telegram sendPhoto error:", e2);
        return { ok: false, reason: "network" };
    }
}

function receiptTelegramPhotoCaption(lang) {
    const l = String(lang || "ru").toLowerCase();
    if (l === "uz-cyrl" || l === "uz_cyrl") return "📎 Чекга илова";
    if (l === "uz") return "📎 Chek ilovasi";
    return "📎 Вложение к чеку";
}

async function deliverReceiptToTelegram(userRow, plainText, imageAbsPath, lang) {
    const chatId = userRow && userRow.telegram_id != null ? String(userRow.telegram_id).trim() : "";
    if (!BOT_TOKEN || !chatId) {
        return {
            telegramSent: false,
            telegramPhotoSent: false,
            reason: !BOT_TOKEN ? "no_bot_token" : "no_telegram_id"
        };
    }
    const text = String(plainText || "").trim() || "TOZA YURAK — чек";
    const msg = await telegramSendMessage(chatId, text);
    if (!msg.ok) {
        return {
            telegramSent: false,
            telegramPhotoSent: false,
            reason: String(msg.reason || "telegram_send_failed").slice(0, 200)
        };
    }
    let photoOk = false;
    if (imageAbsPath && fs.existsSync(imageAbsPath)) {
        const cap = receiptTelegramPhotoCaption(lang);
        const ph = await telegramSendPhotoFromFile(chatId, imageAbsPath, cap);
        photoOk = Boolean(ph.ok);
    }
    return { telegramSent: true, telegramPhotoSent: photoOk, reason: null };
}

/** Bugun/oy chegarasi: O‘zbekiston vaqti yoki TZ= (Renderda odatda UTC). */
function resolveAppTimeZone() {
    const raw = String(process.env.APP_TIMEZONE || process.env.TZ || "Asia/Tashkent").trim();
    const tz = raw || "UTC";
    try {
        new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(new Date());
        return tz;
    } catch (e) {
        return "UTC";
    }
}

const APP_TIME_ZONE = resolveAppTimeZone();

/** SQLite datetime('now') UTC ko‘rinishida; sana bilan solishtirish uchun UTC ga normalize qilamiz. */
function parseSqliteCreatedAtAsUtc(s) {
    const t = String(s || "").trim();
    if (!t) return new Date(NaN);
    if (/[zZ]$/.test(t) || /[+-]\d{2}:?\d{2}$/.test(t)) return new Date(t);
    const norm = t.includes("T") ? t : t.replace(" ", "T");
    if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(norm)) return new Date(norm);
    return new Date(norm + "Z");
}

function ymdInTimeZone(date, timeZone) {
    if (!date || isNaN(date.getTime())) return "";
    try {
        return new Intl.DateTimeFormat("en-CA", {
            timeZone: timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(date);
    } catch (e) {
        return "";
    }
}

function ymInTimeZone(date, timeZone) {
    if (!date || isNaN(date.getTime())) return "";
    try {
        var parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: timeZone,
            year: "numeric",
            month: "2-digit"
        }).formatToParts(date);
        var y = "";
        var m = "";
        for (var i = 0; i < parts.length; i++) {
            if (parts[i].type === "year") y = parts[i].value;
            if (parts[i].type === "month") m = parts[i].value;
        }
        return y && m ? y + "-" + m : "";
    } catch (e2) {
        return "";
    }
}

/**
 * Umumiy daromad = barcha status=completed tranzaksiyalar yig‘indisi (chiqim manfiy amount bo‘lsa ayiriladi).
 * Bugun/oy — APP_TIME_ZONE bo‘yicha kalendarda.
 */
function financeAggregatesForUser(database, userId, timeZone) {
    var tz = String(timeZone || "UTC").trim() || "UTC";
    var rows = database
        .prepare(
            `SELECT amount, created_at FROM transactions
       WHERE user_id = ? AND status = 'completed'`
        )
        .all(userId);
    var now = new Date();
    var todayKey = ymdInTimeZone(now, tz);
    var monthKey = ymInTimeZone(now, tz);
    var total = 0;
    var today = 0;
    var month = 0;
    var i;
    for (i = 0; i < rows.length; i++) {
        var amt = Number(rows[i].amount);
        if (!Number.isFinite(amt)) continue;
        total += amt;
        var d = parseSqliteCreatedAtAsUtc(rows[i].created_at);
        if (ymdInTimeZone(d, tz) === todayKey) today += amt;
        if (ymInTimeZone(d, tz) === monthKey) month += amt;
    }
    var n = rows.length;
    var avg = n > 0 ? total / n : 0;
    var opsRow = database.prepare(`SELECT COUNT(*) AS c FROM transactions WHERE user_id = ?`).get(userId);
    var ops = opsRow ? Number(opsRow.c) || 0 : 0;
    return { total: total, today: today, month: month, avg: avg, completedCount: n, operationsCount: ops };
}

/**
 * Referral daraxti bo‘yicha jamoa ko‘rsatkichlarini bazadan hisoblab users jadvaliga yozadi
 * (dashboard / hamkorlar ekranlari haqiqiy ma’lumot ko‘rsatsin).
 */
function syncUserNetworkStats(database, userId) {
    const uid = Number(userId);
    if (!Number.isFinite(uid) || uid <= 0) return;

    const dRow = database.prepare(`SELECT COUNT(*) AS c FROM users WHERE referred_by_user_id = ?`).get(uid);
    const directCount = dRow ? Number(dRow.c) || 0 : 0;

    const tRow = database
        .prepare(
            `WITH RECURSIVE downline(id) AS (
        SELECT id FROM users WHERE referred_by_user_id = ?
        UNION ALL
        SELECT u.id FROM users u INNER JOIN downline d ON u.referred_by_user_id = d.id
      )
      SELECT COUNT(*) AS c FROM downline`
        )
        .get(uid);
    const teamTotal = tRow ? Number(tRow.c) || 0 : 0;

    const mRow = database
        .prepare(
            `WITH RECURSIVE downline(id) AS (
        SELECT id FROM users WHERE referred_by_user_id = ?
        UNION ALL
        SELECT u.id FROM users u INNER JOIN downline d ON u.referred_by_user_id = d.id
      )
      SELECT COUNT(*) AS c FROM downline d
      INNER JOIN users u ON u.id = d.id AND u.in_marketing_structure = 1`
        )
        .get(uid);
    const activeDownline = mRow ? Number(mRow.c) || 0 : 0;

    const ptRow = database
        .prepare(
            `SELECT COUNT(*) AS c FROM users p WHERE p.referred_by_user_id = ?
       AND EXISTS (SELECT 1 FROM users c WHERE c.referred_by_user_id = p.id)`
        )
        .get(uid);
    const partnerTeams = ptRow ? Number(ptRow.c) || 0 : 0;

    const pimRow = database
        .prepare(
            `SELECT COUNT(*) AS c FROM users WHERE referred_by_user_id = ? AND in_marketing_structure = 1`
        )
        .get(uid);
    const partnerInMkt = pimRow ? Number(pimRow.c) || 0 : 0;

    database
        .prepare(
            `UPDATE users SET direct_refs = ?, team_total = ?, active_marketing = ?,
      partner_teams = ?, partner_in_marketing = ? WHERE id = ?`
        )
        .run(directCount, teamTotal, activeDownline, partnerTeams, partnerInMkt, uid);
}

const db = openDatabase();
const app = express();
app.set("trust proxy", config.TRUST_PROXY);

app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        frameguard: false
    })
);

function isLikelyTelegramMiniAppOrigin(origin) {
    try {
        const u = new URL(origin);
        const h = String(u.hostname || "").toLowerCase();
        if (!h) return false;
        if (h === "web.telegram.org" || h === "telegram.org") return true;
        if (h.endsWith(".telegram.org")) return true;
        if (h === "t.me") return true;
    } catch (e) {
        return false;
    }
    return false;
}

app.use(
    cors({
        credentials: true,
        origin: function (origin, callback) {
            const list = config.getCorsOriginsList();
            if (!origin) {
                return callback(null, true);
            }
            if (!list || list.length === 0) {
                return callback(null, true);
            }
            if (list.indexOf(origin) !== -1) {
                return callback(null, true);
            }
            if (isLikelyTelegramMiniAppOrigin(origin)) {
                return callback(null, true);
            }
            console.warn("[cors] rad etildi:", origin);
            return callback(null, false);
        }
    })
);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: config.isProduction ? 45 : 200,
    message: { ok: false, error: "rate_limited" },
    standardHeaders: true,
    legacyHeaders: false
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: config.isProduction ? 500 : 3000,
    message: { ok: false, error: "rate_limited" },
    standardHeaders: true,
    legacyHeaders: false,
    skip: function (req) {
        return req.method === "GET" && req.path === "/api/health";
    }
});

app.use("/api/auth/", authLimiter);
app.use("/api/", apiLimiter);

app.use(express.json({ limit: "8mb" }));

function requireAuth(req, res, next) {
    const h = req.headers.authorization || "";
    const m = h.match(/^Bearer\s+(.+)$/i);
    if (!m) {
        return res.status(401).json({ ok: false, error: "auth_required" });
    }
    const token = m[1].trim();
    const user = db
        .prepare(
            `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')`
        )
        .get(token);
    if (!user) {
        return res.status(401).json({ ok: false, error: "auth_invalid" });
    }
    req.authUser = user;
    req.authToken = token;
    next();
}

function refUrlFromCode(code) {
    return "https://t.me/toza_yurakli_saxiy_qollar_bot?start=" + encodeURIComponent(String(code || ""));
}

app.get("/api/health", function (_req, res) {
    let dbOk = false;
    try {
        db.prepare("SELECT 1 AS ok").get();
        dbOk = true;
    } catch (e) {
        console.error("health db:", e);
    }
    const payload = {
        ok: dbOk,
        db: dbOk ? "sqlite" : "unavailable",
        dbConnected: dbOk,
        time: new Date().toISOString(),
        appTimeZone: APP_TIME_ZONE,
        referralBonusAmount: REFERRAL_BONUS_AMOUNT,
        env: config.isProduction ? "production" : "development",
        auth: {
            telegramConfigured: Boolean(BOT_TOKEN),
            bootstrapAllowed: config.isBootstrapAllowed()
        }
    };
    if (!dbOk) {
        return res.status(503).json(payload);
    }
    res.json(payload);
});

function issueSession(userId) {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 86400000 * config.SESSION_MAX_DAYS).toISOString();
    db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?,?,?)").run(token, userId, expires);
    return token;
}

function grantReferralBonus(referrerUserId, inviteeDisplayName) {
    if (!referrerUserId || REFERRAL_BONUS_AMOUNT <= 0) return;
    const label = String(inviteeDisplayName || "").trim() || "новый партнёр";
    const description = "Реферальный бонус: " + label;
    db.prepare(
        `INSERT INTO transactions (user_id, type, amount, status, description)
     VALUES (?,?,?,?,?)`
    ).run(referrerUserId, "referral", REFERRAL_BONUS_AMOUNT, "completed", description);
    db.prepare(`UPDATE users SET balance_total = balance_total + ? WHERE id = ?`).run(
        REFERRAL_BONUS_AMOUNT,
        referrerUserId
    );
}

function resolveReferrerUserId(startParam, newTelegramId) {
    if (!startParam) return null;
    const code = String(startParam).trim().slice(0, 64);
    if (!code) return null;
    if (code === "t" + String(newTelegramId)) return null;
    const parent = db.prepare("SELECT id, telegram_id FROM users WHERE ref_code = ?").get(code);
    if (!parent) return null;
    if (parent.telegram_id != null && String(parent.telegram_id) === String(newTelegramId)) {
        return null;
    }
    return parent.id;
}

function upsertUserFromTelegram(tgUser, startParam) {
    const tid = String(tgUser.id);
    const uname = String(tgUser.username || "")
        .replace(/^@/, "")
        .trim()
        .toLowerCase();
    const fullName = [tgUser.first_name, tgUser.last_name]
        .filter(function (x) {
            return x && String(x).trim();
        })
        .map(function (x) {
            return String(x).trim();
        })
        .join(" ");
    const displayName = fullName || "Telegram user";
    const letter = displayName.slice(0, 1).toUpperCase() || "U";

    const existing = db.prepare("SELECT * FROM users WHERE telegram_id = ?").get(tid);
    if (existing) {
        db.prepare(
            `UPDATE users SET username = ?, full_name = ?, avatar_letter = ?
       WHERE telegram_id = ?`
        ).run(uname, displayName, letter, tid);
        let row = db.prepare("SELECT * FROM users WHERE telegram_id = ?").get(tid);
        if (row && row.referred_by_user_id == null && startParam) {
            const referredBy = resolveReferrerUserId(startParam, tid);
            if (referredBy) {
                const info = db
                    .prepare(
                        `UPDATE users SET referred_by_user_id = ?
             WHERE id = ? AND referred_by_user_id IS NULL`
                    )
                    .run(referredBy, row.id);
                if (info.changes > 0) {
                    db.prepare("UPDATE users SET direct_refs = direct_refs + 1 WHERE id = ?").run(referredBy);
                    grantReferralBonus(referredBy, displayName);
                    syncUserNetworkStats(db, referredBy);
                }
                row = db.prepare("SELECT * FROM users WHERE telegram_id = ?").get(tid);
            }
        }
        return row;
    }

    const refCode = "t" + tid;
    const joined = new Date().toISOString().slice(0, 10);
    const referredBy = resolveReferrerUserId(startParam, tid);
    db.prepare(
        `INSERT INTO users (
      telegram_id, username, full_name, avatar_letter, ref_code, joined_at, referred_by_user_id
    ) VALUES (?,?,?,?,?,?,?)`
    ).run(tid, uname, displayName, letter, refCode, joined, referredBy);
    if (referredBy) {
        db.prepare("UPDATE users SET direct_refs = direct_refs + 1 WHERE id = ?").run(referredBy);
        grantReferralBonus(referredBy, displayName);
        syncUserNetworkStats(db, referredBy);
    }
    return db.prepare("SELECT * FROM users WHERE telegram_id = ?").get(tid);
}

app.post("/api/auth/telegram", function (req, res) {
    if (!BOT_TOKEN) {
        return res.status(503).json({ ok: false, error: "bot_not_configured" });
    }
    const initData = String((req.body && req.body.initData) || "").trim();
    if (!initData) {
        return res.status(400).json({ ok: false, error: "init_data_required" });
    }
    const checked = verifyWebAppInitData(initData, BOT_TOKEN, 86400);
    if (!checked.ok) {
        return res.status(401).json({ ok: false, error: "telegram_invalid", detail: checked.reason });
    }
    const row = upsertUserFromTelegram(checked.user, checked.startParam);
    const token = issueSession(row.id);
    res.json({
        ok: true,
        token,
        userId: row.id,
        referredByApplied: Boolean(row.referred_by_user_id),
        telegram: {
            id: checked.user.id,
            username: checked.user.username || ""
        }
    });
});

app.post("/api/auth/bootstrap", function (_req, res) {
    if (!config.isBootstrapAllowed()) {
        return res.status(403).json({ ok: false, error: "bootstrap_disabled" });
    }
    const user = db.prepare("SELECT id FROM users ORDER BY id ASC LIMIT 1").get();
    if (!user) {
        return res.status(500).json({ ok: false, error: "no_user_seed" });
    }
    const token = issueSession(user.id);
    res.json({ ok: true, token, userId: user.id });
});

app.get("/api/dashboard", requireAuth, function (req, res) {
    const uid = req.authUser.id;
    syncUserNetworkStats(db, uid);
    const u = db.prepare("SELECT * FROM users WHERE id = ?").get(uid);
    if (!u) {
        return res.status(500).json({ ok: false, error: "user_missing" });
    }

    const agg = financeAggregatesForUser(db, uid, APP_TIME_ZONE);
    db.prepare(`UPDATE users SET balance_total = ? WHERE id = ?`).run(agg.total, uid);

    const recent = db
        .prepare(
            `SELECT id, type, amount, status, description, created_at
       FROM transactions WHERE user_id = ?
       ORDER BY datetime(created_at) DESC LIMIT 100`
        )
        .all(uid);

    let referrer = null;
    if (u.referred_by_user_id) {
        const inv = db
            .prepare("SELECT full_name, username, ref_code FROM users WHERE id = ?")
            .get(u.referred_by_user_id);
        if (inv) {
            referrer = {
                fullName: inv.full_name,
                username: inv.username,
                refCode: inv.ref_code
            };
        }
    }

    const bizcard = parseUserBizcardJson(u.bizcard_json);

    res.json({
        ok: true,
        bizcard: bizcard,
        user: {
            id: u.id,
            telegramId: u.telegram_id != null && u.telegram_id !== "" ? String(u.telegram_id) : null,
            fullName: u.full_name,
            username: u.username,
            avatarLetter: u.avatar_letter,
            refCode: u.ref_code,
            refUrl: refUrlFromCode(u.ref_code),
            balance: agg.total,
            teamTotal: u.team_total,
            directRefs: u.direct_refs,
            activeMarketing: u.active_marketing,
            level: u.level_num,
            levelLabel: u.level_label,
            levelSubtitle: u.level_subtitle,
            levelMeta: u.level_meta,
            joinedAt: u.joined_at,
            inMarketingStructure: Boolean(u.in_marketing_structure),
            referrer: referrer
        },
        financeSummary: {
            total: agg.total,
            today: agg.today,
            month: agg.month,
            operationsCount: agg.operationsCount,
            average: agg.avg,
            timeZone: APP_TIME_ZONE
        },
        transactions: recent,
        partners: {
            direct: u.direct_refs,
            active: u.active_marketing,
            teams: u.partner_teams,
            inMarketing: u.partner_in_marketing,
            teamLeadName: u.full_name
        }
    });
});

app.put("/api/user/bizcard", requireAuth, function (req, res) {
    try {
        const body = req.body || {};
        let data = body.data;
        if (data === undefined) data = body;
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            return res.status(400).json({ ok: false, error: "invalid_body" });
        }
        const json = JSON.stringify(data);
        if (json.length > BIZCARD_JSON_MAX_BYTES) {
            return res.status(400).json({ ok: false, error: "bizcard_too_large" });
        }
        db.prepare("UPDATE users SET bizcard_json = ? WHERE id = ?").run(json, req.authUser.id);
        res.json({ ok: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, error: "server_error" });
    }
});

app.get("/api/transactions", requireAuth, function (req, res) {
    const uid = req.authUser.id;
    const type = String(req.query.type || "").trim();
    const status = String(req.query.status || "").trim();
    const from = String(req.query.from || "").trim();
    const to = String(req.query.to || "").trim();

    let sql = `SELECT id, type, amount, status, description, created_at FROM transactions WHERE user_id = ?`;
    const params = [uid];

    if (type && type !== "all") {
        sql += " AND type = ?";
        params.push(type);
    }
    if (status && status !== "all") {
        sql += " AND status = ?";
        params.push(status);
    }
    if (from) {
        sql += " AND date(created_at) >= date(?)";
        params.push(from);
    }
    if (to) {
        sql += " AND date(created_at) <= date(?)";
        params.push(to);
    }
    sql += " ORDER BY datetime(created_at) DESC LIMIT 200";

    const rows = db.prepare(sql).all(...params);
    res.json({ ok: true, transactions: rows });
});

app.post("/api/receipts", requireAuth, async function (req, res) {
    try {
        const u = req.authUser;
        const body = req.body || {};
        const amount = Number(body.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ ok: false, error: "invalid_amount" });
        }
        const recipient = String(body.recipient || "").trim().slice(0, 500);
        if (!recipient) {
            return res.status(400).json({ ok: false, error: "invalid_recipient" });
        }

        const id = crypto.randomBytes(16).toString("hex");
        let imageFile = null;

        if (body.imageBase64 && typeof body.imageBase64 === "string") {
            const m = body.imageBase64.match(/^data:image\/(\w+);base64,(.+)$/i);
            if (m) {
                const buf = Buffer.from(m[2], "base64");
                if (buf.length > MAX_IMAGE_BYTES) {
                    return res.status(400).json({ ok: false, error: "image_too_large" });
                }
                fs.mkdirSync(RECEIPT_IMG_DIR, { recursive: true });
                const ext = m[1].toLowerCase() === "jpeg" ? "jpg" : m[1].toLowerCase();
                imageFile = id + "." + ext;
                fs.writeFileSync(path.join(RECEIPT_IMG_DIR, imageFile), buf);
            }
        }

        const lang = String(body.language || "ru").slice(0, 20);
        const plainStored = String(body.plainText || "").slice(0, 12000);

        db.prepare(
            `INSERT INTO receipts (
          id, user_id, amount, recipient, description, from_name, date_str,
          has_attachment, plain_text, image_file, language
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
        ).run(
            id,
            u.id,
            amount,
            recipient,
            String(body.description || "").slice(0, 2000),
            String(body.from || "").slice(0, 500),
            String(body.dateStr || "").slice(0, 120),
            body.hasAttachment ? 1 : 0,
            plainStored,
            imageFile,
            lang
        );

        const imageAbs = imageFile ? path.join(RECEIPT_IMG_DIR, imageFile) : null;
        const tg = await deliverReceiptToTelegram(u, plainStored, imageAbs, lang);

        const out = {
            ok: true,
            id,
            telegramSent: Boolean(tg.telegramSent),
            telegramPhotoSent: Boolean(tg.telegramPhotoSent)
        };
        if (!config.isProduction && tg.reason) {
            out.telegramDebug = tg.reason;
        }
        res.status(201).json(out);
    } catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, error: "server_error" });
    }
});

app.use("/api", function (_req, res) {
    res.status(404).json({ ok: false, error: "not_found" });
});

app.use(express.static(ROOT, { extensions: ["html"] }));

app.use(function (err, _req, res, _next) {
    console.error(err);
    if (res.headersSent) {
        return;
    }
    res.status(500).json({ ok: false, error: "server_error" });
});

const server = app.listen(PORT, HOST, function () {
    console.log("SQLite:", path.join(DATA_DIR, "app.db"));
    console.log("Rejim:  ", config.isProduction ? "production" : "development");
    console.log("Host:   ", HOST + " (0.0.0.0 = barcha tarmoq interfeyslari)");
    console.log("Mahalliy: http://127.0.0.1:" + PORT + "/");
    console.log("API:      http://127.0.0.1:" + PORT + "/api/");
    try {
        var ifs = os.networkInterfaces();
        Object.keys(ifs).forEach(function (name) {
            (ifs[name] || []).forEach(function (iface) {
                if (!iface) return;
                var fam = iface.family;
                var v4 = fam === "IPv4" || fam === 4;
                if (v4 && !iface.internal) {
                    console.log("LAN:      http://" + iface.address + ":" + PORT + "/");
                }
            });
        });
    } catch (e) {}
    if (!BOT_TOKEN) {
        console.warn("TELEGRAM_BOT_TOKEN o'rnatilmagan — /api/auth/telegram ishlamaydi (bootstrap ishlaydi).");
    }
});

function shutdown(signal) {
    return function () {
        console.log(signal + " — server yopilmoqda…");
        server.close(function () {
            try {
                db.close();
            } catch (e) {}
            process.exit(0);
        });
        setTimeout(function () {
            process.exit(1);
        }, 10000).unref();
    };
}

process.on("SIGTERM", shutdown("SIGTERM"));
process.on("SIGINT", shutdown("SIGINT"));
