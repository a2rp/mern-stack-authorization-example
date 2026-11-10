require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./config/db.config");
const errorHandler = require("./middlewares/error.middleware");
const requireTrustedOrigin = require("./middlewares/requireTrustedOrigin");

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "OPTIONS"],
}));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use((req, res, next) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
        return requireTrustedOrigin(req, res, next);
    }
    return next();
});

app.get("/health", (_req, res) => res.json({ success: true }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/private", require("./routes/private.routes"));
app.use((_req, res) => res.status(404).json({ success: false, error: "Route not found." }));
app.use(errorHandler);

if (require.main === module) {
    const start = async () => {
        await connectDB();
        const port = Number(process.env.PORT) || 1198;
        app.listen(port, () => console.log("Server listening on port " + port));
    };
    start().catch((error) => {
        console.error("Server startup failed:", error.name);
        process.exitCode = 1;
    });
}

module.exports = app;
