"use strict";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const NODE_ENV = String(process.env.NODE_ENV || "development").toLowerCase();
const isProduction = NODE_ENV === "production";

const BOT_TOKEN = String(process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || "").trim();

function parseTrustProxy() {
    const v = String(process.env.TRUST_PROXY || "").trim();
    if (v === "0" || v === "false") return 0;
    if (v === "1" || v === "true" || v === "") return isProduction ? 1 : 0;
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 0 ? n : isProduction ? 1 : 0;
}

/** CORS_ORIGINS vergul bilan + PUBLIC_APP_URL (bitta asosiy Mini App HTTPS manzili) */
function getCorsOriginsList() {
    const raw = String(process.env.CORS_ORIGINS || "").trim();
    const pub = String(process.env.PUBLIC_APP_URL || "")
        .trim()
        .replace(/\/$/, "");
    const list = [];
    if (raw) {
        raw.split(",").forEach(function (s) {
            const t = s.trim();
            if (t) {
                list.push(t);
            }
        });
    }
    if (pub) {
        list.push(pub);
    }
    const seen = Object.create(null);
    const out = [];
    list.forEach(function (x) {
        if (!seen[x]) {
            seen[x] = true;
            out.push(x);
        }
    });
    return out.length ? out : null;
}

function parseSessionMaxDays() {
    const d = parseInt(String(process.env.SESSION_MAX_DAYS || "365"), 10);
    if (!Number.isFinite(d)) return 365;
    return Math.min(3650, Math.max(1, d));
}

function isBootstrapAllowed() {
    const raw = String(process.env.ALLOW_AUTH_BOOTSTRAP || "").trim().toLowerCase();
    if (raw === "0" || raw === "false" || raw === "no") return false;
    if (raw === "1" || raw === "true" || raw === "yes") return true;
    if (!BOT_TOKEN) return true;
    return !isProduction;
}

function assertProductionSafe() {
    if (!isProduction) return;
    if (!BOT_TOKEN) {
        console.error("[config] NODE_ENV=production: TELEGRAM_BOT_TOKEN majburiy. To'xtatildi.");
        process.exit(1);
    }
    if (isBootstrapAllowed()) {
        console.warn(
            "[config] Ogohlantirish: productionda ALLOW_AUTH_BOOTSTRAP yoqilgan — faqat texnik xizmat uchun."
        );
    }
    const cors = getCorsOriginsList();
    if (!cors || cors.length === 0) {
        console.warn(
            "[config] Ogohlantirish: PUBLIC_APP_URL yoki CORS_ORIGINS bo'sh — frontend boshqa domenida bo'lsa " +
                "so'rovlar bloklanishi mumkin."
        );
    }
}

module.exports = {
    NODE_ENV,
    isProduction,
    PORT: Number(process.env.PORT) || 3847,
    HOST: String(process.env.HOST || "0.0.0.0").trim() || "0.0.0.0",
    BOT_TOKEN,
    TRUST_PROXY: parseTrustProxy(),
    getCorsOriginsList,
    SESSION_MAX_DAYS: parseSessionMaxDays(),
    isBootstrapAllowed,
    assertProductionSafe
};
