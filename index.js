const dotenv = require('dotenv');
const express = require("express");
const app = express();

dotenv.config();

app.listen(process.env.PORT, () => console.log(`'Server up and running on port ${process.env.PORT}`));
