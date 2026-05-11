"use strict";

const crypto = require("crypto");

/**
 * Validates Telegram.WebApp.initData per
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
function verifyWebAppInitData(initData, botToken, maxAgeSec) {
    if (!initData || !botToken) {
        return { ok: false, reason: "missing" };
    }
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) {
        return { ok: false, reason: "no_hash" };
    }

    const authDate = params.get("auth_date");
    if (authDate) {
        const ts = parseInt(authDate, 10);
        if (Number.isFinite(ts)) {
            const maxAge = maxAgeSec != null ? maxAgeSec : 86400;
            if (Date.now() / 1000 - ts > maxAge) {
                return { ok: false, reason: "expired" };
            }
        }
    }

    params.delete("hash");
    const pairs = [...params.entries()].sort(function (a, b) {
        return a[0].localeCompare(b[0]);
    });
    const dataCheckString = pairs
        .map(function (kv) {
            return kv[0] + "=" + kv[1];
        })
        .join("\n");

    const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
    const calculated = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

    let a;
    let b;
    try {
        a = Buffer.from(hash, "hex");
        b = Buffer.from(calculated, "hex");
    } catch {
        return { ok: false, reason: "bad_hash" };
    }
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return { ok: false, reason: "bad_hash" };
    }

    const userJson = params.get("user");
    if (!userJson) {
        return { ok: false, reason: "no_user" };
    }
    let user;
    try {
        user = JSON.parse(userJson);
    } catch {
        return { ok: false, reason: "bad_user" };
    }
    if (!user || typeof user.id !== "number") {
        return { ok: false, reason: "bad_user" };
    }

    const startRaw = params.get("start_param");
    const startParam =
        startRaw != null && String(startRaw).trim() !== ""
            ? String(startRaw).trim().slice(0, 64)
            : null;

    return { ok: true, user: user, startParam: startParam };
}

module.exports = { verifyWebAppInitData };
