const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

module.exports = (req, res, next) => {
    const origin = req.get("origin");
    if (origin && allowedOrigins.includes(origin.replace(/\/+$/, ""))) return next();
    return res.status(403).json({ success: false, error: "This origin is not allowed." });
};
