const app = require('./app');
const colors = require("colors");

const dotenv = require('dotenv');
const connectDatabase = require("./utils/database")

// Config

dotenv.config({path:"config.env"});

// Connecting to ddatabase
connectDatabase();

// Initializing PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log(
        `Server Started in http://localhost:${PORT}`.yellow
    );
});