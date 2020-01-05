const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const authRoute = require("./routes/auth");

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to db")
);

//Route Middlewares
app.use("/api/user", authRoute);

app.listen(process.env.PORT, () =>
    console.log(`'Server up and running on port ${process.env.PORT}`)
);
