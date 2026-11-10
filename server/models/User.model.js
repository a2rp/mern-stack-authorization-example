const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,72}$/;

const UserSchema = new mongoose.Schema({
    username: { type: String, trim: true, required: true, minlength: 2, maxlength: 80 },
    email: {
        type: String, trim: true, lowercase: true, unique: true, required: true, maxlength: 254,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email."],
    },
    password: {
        type: String, required: true, select: false, minlength: 12, maxlength: 72,
        match: [passwordPattern, "Use 12-72 characters with uppercase, lowercase, a number, and a symbol."],
    },
    tokenVersion: { type: Number, default: 0, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
}, { timestamps: true });

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.tokenVersion = (this.tokenVersion || 0) + 1;
    this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.matchPasswords = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
    const secret = process.env.JWT_SECRET;
    if (typeof secret !== "string" || Buffer.byteLength(secret, "utf8") < 32) {
        throw new Error("JWT_SECRET must contain at least 32 bytes.");
    }
    return jwt.sign(
        { id: this._id.toString(), tokenVersion: this.tokenVersion },
        secret,
        { expiresIn: process.env.JWT_EXPIRE || "3d", algorithm: "HS256" }
    );
};

UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
