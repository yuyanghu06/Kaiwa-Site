const express = require('express');
const session = require('express-session');

const app = express();

// Middleware to parse request body
app.use(express.json());

// Configure session middleware
app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true in production with HTTPS
}));

app.post()

app.listen(3000, () => console.log('Server running on port 3000'));