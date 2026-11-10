const ErrorResponse = require("../utils/errorResponse.util");

const errorHandler = (err, _req, res, next) => {
    if (res.headersSent) return next(err);
    let statusCode = err.statusCode || 500;
    let message = err.message || "Server Error";

    if (err.message === "Origin not allowed by CORS") {
        statusCode = 403;
        message = "This origin is not allowed.";
    } else if (err.type === "entity.parse.failed") {
        statusCode = 400;
        message = "Request body must contain valid JSON.";
    } else if (err.type === "entity.too.large") {
        statusCode = 413;
        message = "Request body is too large.";
    } else if (err.code === 11000) {
        statusCode = 409;
        message = "An account with these details already exists.";
    } else if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Check the account details and try again.";
    } else if (statusCode >= 500) {
        console.error("Request failed:", err.name);
        message = "Unable to process this request right now.";
    }

    if (err instanceof ErrorResponse && statusCode < 500) message = err.message;
    return res.status(statusCode).json({ success: false, error: message });
};

module.exports = errorHandler;
