"use strict";

/**
 * Netlify / statik hosting: agar /api proksi ishlamasa, script.js /api-config.json dan apiBase o‘qiydi.
 * TY_BACKEND_URL (Netlify env) yoki BACKEND_URL — toza HTTPS API ildizi, oxirida / va /api bo‘lmasin.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const outPath = path.join(root, "api-config.json");

const raw = (process.env.TY_BACKEND_URL || process.env.BACKEND_URL || "").trim();
let base = raw.replace(/\/$/, "").replace(/\/api$/i, "");

if (!base || /replace/i.test(base)) {
    try {
        if (fs.existsSync(outPath)) {
            fs.unlinkSync(outPath);
        }
    } catch (e) {}
    console.info("[write-api-config] TY_BACKEND_URL yo'q — api-config.json yaratilmadi (nisbiy /api yoki meta ishlatiladi)");
    process.exit(0);
}

const body = JSON.stringify({ apiBase: base }, null, 2) + "\n";
fs.writeFileSync(outPath, body, "utf8");
console.info("[write-api-config] api-config.json → apiBase=" + base);
