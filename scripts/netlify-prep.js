"use strict";

/**
 * Netlify build: TY_BACKEND_URL dan _redirects yaratadi.
 * Brauzer https://SIZ.netlify.app/api/* ga so‘raydi → Netlify proksi orqali backendga.
 *
 * Netlify: Site settings → Environment variables → TY_BACKEND_URL
 * Qiymat: https://your-app.onrender.com (oxirida / va /api bo‘lmasin)
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const redirectsPath = path.join(root, "_redirects");

const raw = (process.env.TY_BACKEND_URL || process.env.BACKEND_URL || "").trim();
const base = raw.replace(/\/$/, "").replace(/\/api$/i, "");

var body;
if (!base) {
    body = [
        "# Netlify build: TY_BACKEND_URL o'rnatilmagan (Site settings → Environment variables)",
        "# Namuna: https://toza-api.onrender.com",
        "/api/*  https://REPLACE-WITH-YOUR-BACKEND.onrender.com/api/:splat  200",
        ""
    ].join("\n");
    console.warn("[netlify-prep] TY_BACKEND_URL yo'q — placeholder _redirects (API ishlamaydi)");
} else if (/replace/i.test(base)) {
    body = [
        "# TY_BACKEND_URL hali placeholder",
        "/api/*  https://REPLACE-WITH-YOUR-BACKEND.onrender.com/api/:splat  200",
        ""
    ].join("\n");
    console.warn("[netlify-prep] TY_BACKEND_URL da 'replace' — haqiqiy HTTPS manzilni kiriting");
} else {
    body = [
        "# Avtomatik: TY_BACKEND_URL=" + base,
        "/api/*  " + base + "/api/:splat  200",
        ""
    ].join("\n");
    console.info("[netlify-prep] Proksi: /api/* → " + base + "/api/*");
}

fs.writeFileSync(redirectsPath, body, "utf8");
