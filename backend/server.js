const app = require('./app');
const colors = require("colors");

const dotenv = require('dotenv');

// Config

dotenv.config({path:"backend/config/config.env"});

// Initializing PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log(
        `Server Started in http://localhost:${PORT}`.yellow
    );
});