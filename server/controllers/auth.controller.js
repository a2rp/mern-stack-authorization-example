const crypto = require("crypto");
const User = require("../models/User.model");
const ErrorResponse = require("../utils/errorResponse.util");
const sendEmail = require("../utils/sendEmail.util");
const { authCookieOptions, clearAuthCookieOptions } = require("../utils/authCookie.util");

const publicUser = (user) => ({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
});
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,72}$/;
const validPassword = (value) =>
    typeof value === "string"
    && Buffer.byteLength(value, "utf8") <= 72
    && passwordPattern.test(value);

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.cookie("token", token, authCookieOptions);
    return res.status(statusCode).json({ success: true, user: publicUser(user) });
};

exports.register = async (req, res, next) => {
    const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = req.body?.password;

    if (username.length < 2 || username.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !validPassword(password)) {
        return next(new ErrorResponse("Check the account details and try again.", 400));
    }

    try {
        if (await User.exists({ email })) {
            return next(new ErrorResponse("Unable to create an account with those details.", 409));
        }
        const user = await User.create({ username, email, password });
        return sendToken(user, 201, res);
    } catch (error) {
        return next(error);
    }
};

exports.login = async (req, res, next) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = req.body?.password;
    if (!email || typeof password !== "string" || Buffer.byteLength(password, "utf8") > 72) {
        return next(new ErrorResponse("Email or password is incorrect.", 401));
    }

    try {
        const user = await User.findOne({ email }).select("+password +tokenVersion");
        const matches = user ? await user.matchPasswords(password) : false;
        if (!user || !matches) {
            return next(new ErrorResponse("Email or password is incorrect.", 401));
        }
        return sendToken(user, 200, res);
    } catch (error) {
        return next(error);
    }
};

exports.logout = (_req, res) => {
    res.clearCookie("token", clearAuthCookieOptions);
    return res.json({ success: true, message: "Logged out." });
};

exports.forgotPassword = async (req, res, next) => {
    const genericResponse = { success: true, message: "If the account exists, a password reset email has been sent." };
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(200).json(genericResponse);

    try {
        const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpire +tokenVersion");
        if (!user) return res.status(200).json(genericResponse);

        const resetToken = user.getResetPasswordToken();
        await user.save();

        const clientUrl = (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/+$/, "");
        const resetUrl = clientUrl + "/#/resetpassword/" + encodeURIComponent(resetToken);
        const html = [
            "<h1>Password reset requested</h1>",
            "<p>Use the link below within 15 minutes to choose a new password.</p>",
            '<p><a href="' + resetUrl + '">Reset your password</a></p>',
        ].join("");

        try {
            await sendEmail({
                to: user.email,
                subject: "Password reset request",
                text: "Use this link within 15 minutes to reset your password: " + resetUrl,
                html,
            });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            console.error("Password reset email failed:", emailError.name);
            return res.status(200).json(genericResponse);
        }

        return res.status(200).json(genericResponse);
    } catch (error) {
        return next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    const rawToken = req.params.resetToken;
    const password = req.body?.password;
    if (typeof rawToken !== "string" || !/^[a-f0-9]{64}$/i.test(rawToken) || !validPassword(password)) {
        return next(new ErrorResponse("This reset link is invalid or expired.", 400));
    }

    const resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    try {
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: new Date() } })
            .select("+resetPasswordToken +resetPasswordExpire +tokenVersion");
        if (!user) return next(new ErrorResponse("This reset link is invalid or expired.", 400));

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.clearCookie("token", clearAuthCookieOptions);
        return res.json({ success: true, message: "Password reset successfully. Please sign in again." });
    } catch (error) {
        return next(error);
    }
};
