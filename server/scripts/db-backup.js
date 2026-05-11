"use strict";

const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const src = path.join(dataDir, "app.db");
const destDir = path.join(dataDir, "backups");

function main() {
    if (!fs.existsSync(src)) {
        console.error("db-backup: app.db topilmadi:", src);
        process.exit(1);
    }
    fs.mkdirSync(destDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const dest = path.join(destDir, "app-" + stamp + ".db");
    fs.copyFileSync(src, dest);
    console.log("db-backup: nusxa saqlandi:", dest);
}

main();
