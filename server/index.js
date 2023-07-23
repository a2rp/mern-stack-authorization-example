require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db.config");
const errorHandler = require("./middlewares/error.middleware");

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/private", require("./routes/private.routes"));

// error handler shoul be the last piece of middleware
app.use(errorHandler);

const PORT = process.env.PORT || 1198;
const server = app.listen(PORT, console.log(`running on port ${PORT}`));
process.on("unhandledRejection", (err, promise) => {
    console.log(`logged error: ${err}`);
    server.close(() => process.exit(1));
});
