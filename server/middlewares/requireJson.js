module.exports = (req, res, next) => {
    if (!req.is("application/json")) {
        return res.status(415).json({ success: false, error: "Send the request body as JSON." });
    }
    return next();
};
