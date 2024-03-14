const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const reviews = require('./routes/api/reviews');
const auth = require('./routes/api/auth');
const projects = require('./routes/api/projects');
const achievements = require('./routes/api/achievements');

const app = express();

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json());

// Use Routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/reviews', reviews);
app.use('/api/projects', projects);
app.use('/api/achievements', achievements);

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server running on port ${port}`));