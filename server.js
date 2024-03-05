const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const reviews = require('./routes/api/reviews');

const app = express();

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json());

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/reviews', reviews);

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server running on port ${port}`));