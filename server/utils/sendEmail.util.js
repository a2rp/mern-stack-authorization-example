const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const sendEmail = async ({ to, subject, text, html }) => {
    const required = ["CLIENT_ID", "CLIENT_SECRET", "REDIRECT_URI", "REFRESH_TOKEN", "OAUTH_EMAIL"];
    if (required.some((key) => !process.env[key])) {
        throw new Error("Email configuration is incomplete.");
    }

    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.OAUTH_EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
    });

    return transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.OAUTH_EMAIL,
        to,
        subject,
        text,
        html,
    });
};

module.exports = sendEmail;
