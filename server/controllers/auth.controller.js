const User = require('../models/User.model');
const ErrorResponse = require("../utils/errorResponse.util");
const sendEmail = require('../utils/sendEmail.util');
const crypto = require("crypto");

exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({ username, email, password });
        // res.status(201).json({ success: true, token: "a2rp" });
        sendToken(user, 201, res);
    } catch (error) {
        // console.log(error);
        // res.status(500).json({ success: false, error: error.message });
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please provide email and password", 400));
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorResponse("Email not registered", 401));
        }

        const isMatch = await user.matchPasswords(password);
        if (!isMatch) {
            return next(new ErrorResponse("Password incorrect", 401));
        }

        sendToken(user, 200, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("Fist: Email could not be sent", 404));
        }
        const resetToken = user.getResetPasswordToken();

        await user.save();
        const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;
        const message = `<h1>You have requested a new password reset</h1>
        <p>Please go to this link to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password reset request.",
                text: message
            });
            res.status(200).json({ success: true, data: "Email Sent" });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();
            return next(new ErrorResponse("Second: Email could not be sent", 500));
        }
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    console.log("resetPasswordToken", resetPasswordToken);

    try {
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
        console.log("user", user);

        if (!user) {
            return next(new ErrorResponse("Invalid Reset Token", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.status(201).json({
            success: true,
            data: "Password reset success"
        });
    } catch (error) {
        next(error);
    }
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token });
};

