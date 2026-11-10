const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const ErrorResponse = require("../utils/errorResponse.util");

exports.protect = async (req, res, next) => {
    const secret = process.env.JWT_SECRET;
    if (typeof secret !== "string" || Buffer.byteLength(secret, "utf8") < 32) {
        return next(new ErrorResponse("Authentication is not configured.", 503));
    }
    const token = req.cookies?.token;
    if (!token) return next(new ErrorResponse("Authentication required.", 401));

    let decoded;
    try {
        decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
    } catch (_) {
        return next(new ErrorResponse("Authentication required.", 401));
    }
    if (typeof decoded.id !== "string" || !mongoose.isValidObjectId(decoded.id)) {
        return next(new ErrorResponse("Authentication required.", 401));
    }

    try {
        const user = await User.findById(decoded.id).select("_id username email +tokenVersion");
        if (!user || decoded.tokenVersion !== user.tokenVersion) {
            return next(new ErrorResponse("Authentication required.", 401));
        }
        req.user = user;
        return next();
    } catch (error) {
        console.error("Session verification failed:", error.name);
        return next(new ErrorResponse("Unable to verify this session.", 500));
    }
};
