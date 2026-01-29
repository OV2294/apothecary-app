require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

// ==============================================
// 1. MIDDLEWARE & CONFIGURATION
// ==============================================

// Allow requests
app.use(cors({
    origin: true, 
    credentials: true
}));

app.use(bodyParser.json());

// Serve all static files 
app.use(express.static(path.join(__dirname, '/')));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key_dev', // Use Env Var in Prod
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // True on Render (HTTPS), False on Localhost
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// === DATABASE ===
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, 
    ssl: {
        rejectUnauthorized: false    
    }
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.stack);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

// ==============================================
// 3. AUTHENTICATION ROUTES
// ==============================================

// Register
app.post('/auth/register', async (req, res) => {
    const { username, email, phone, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, email, phone, password_hash) VALUES (?, ?, ?, ?)';

        db.query(sql, [username, email, phone || null, hash], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email already exists' });
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.json({ message: 'Registration successful!' });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';

    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(404).json({ message: 'Email not found' });

        const user = results[0];

        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role
            };

            req.session.save(err => {
                if (err) return res.status(500).json({ message: 'Session Error' });
                res.json({ message: 'Login successful', role: user.role });
            });
        });
    });
});

// Logout
app.post('/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

// Check Current User 
app.get('/auth/me', (req, res) => {
    if (!req.session.user) return res.status(401).json({ loggedIn: false });

    const sql = 'SELECT id, username, email, phone, role, favorite_episode, created_at FROM users WHERE id = ?';
    db.query(sql, [req.session.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error' });
        res.json({ loggedIn: true, user: results[0] });
    });
});

// Password Reset 
app.post('/auth/reset-with-phone', async (req, res) => {
    const { email, phone, newPassword } = req.body;
    if (!email || !phone || !newPassword) return res.status(400).json({ message: 'All fields are required' });

    try {
        const checkSql = 'SELECT id FROM users WHERE email = ? AND phone = ?';
        db.query(checkSql, [email, phone], async (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (results.length === 0) return res.status(401).json({ message: 'Details do not match our records.' });

            const hash = await bcrypt.hash(newPassword, 10);
            const updateSql = 'UPDATE users SET password_hash = ? WHERE email = ?';
            
            db.query(updateSql, [hash, email], (err, result) => {
                if (err) return res.status(500).json({ message: 'Update failed' });
                res.json({ message: 'Password reset successful!' });
            });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==============================================
// 4. USER DATA & INTERACTION ROUTES
// ==============================================

// Update Profile
app.post('/auth/update', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Not logged in' });

    const { username, email, phone, favorite_episode } = req.body;
    const sql = 'UPDATE users SET username = ?, email = ?, phone = ?, favorite_episode = ? WHERE id = ?';

    db.query(sql, [username, email, phone, favorite_episode, req.session.user.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Update failed' });

        req.session.user.username = username;
        req.session.user.email = email;
        req.session.user.phone = phone;
        req.session.user.favorite_episode = favorite_episode;

        req.session.save(() => res.json({ message: 'Profile updated' }));
    });
});

// Set Favorite Episode
app.post('/auth/set-favorite', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Not logged in' });

    const { favoriteString } = req.body;
    const finalFavorite = favoriteString || null;
    const sql = 'UPDATE users SET favorite_episode = ? WHERE id = ?';

    db.query(sql, [finalFavorite, req.session.user.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        req.session.user.favorite_episode = finalFavorite;
        req.session.save(() => {
            res.json({ message: finalFavorite ? 'Favorite updated!' : 'Favorite removed!', favorite: finalFavorite });
        });
    });
});

// Save Watch Progress
app.post('/user/progress', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Not logged in' });

    const { season, episode } = req.body;
    const sql = `INSERT INTO watch_history (user_id, season, episode) VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE season = VALUES(season), episode = VALUES(episode)`;

    db.query(sql, [req.session.user.id, season, episode], (err) => {
        if (err) return res.status(500).json({ message: 'Error saving progress' });
        res.json({ message: 'Progress saved' });
    });
});

// Get Watch Progress
app.get('/user/progress', (req, res) => {
    if (!req.session.user) return res.json({ continue: null });

    const sql = 'SELECT season, episode FROM watch_history WHERE user_id = ?';
    db.query(sql, [req.session.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error' });
        res.json({ continue: results.length > 0 ? results[0] : null });
    });
});

// ==============================================
// 5. CONTENT ROUTES (Anime, Manga, Feedback)
// ==============================================

app.get('/episodes', (req, res) => {
    const season = req.query.season || 1;
    db.query('SELECT * FROM anime_episodes WHERE season = ? ORDER BY episode ASC', [season], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching episodes' });
        res.json(results);
    });
});

app.get('/manga', (req, res) => {
    db.query('SELECT * FROM manga_chapters ORDER BY chapter_number ASC', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching manga' });
        res.json(results);
    });
});

app.get('/comments', (req, res) => {
    const { season, episode } = req.query;
    db.query('SELECT * FROM comments WHERE season = ? AND episode = ? ORDER BY created_at DESC', [season, episode], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching comments' });
        res.json(results);
    });
});

app.post('/comments', (req, res) => {
    const { username, comment, season, episode } = req.body;
    db.query('INSERT INTO comments (username, comment_text, season, episode) VALUES (?, ?, ?, ?)', 
        [username, comment, season, episode], (err) => {
        if (err) return res.status(500).json({ message: 'Error posting comment' });
        res.json({ message: 'Posted!' });
    });
});

app.post('/feedback', (req, res) => {
    const { name, email, message } = req.body;
    db.query('INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)', [name, email, message], (err) => {
        if (err) return res.status(500).json({ message: 'Error sending feedback' });
        res.json({ message: 'Feedback sent!' });
    });
});

// ==============================================
// 6. ADMIN DASHBOARD ROUTE
// ==============================================
app.get('/admin/data', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const queryUsers = 'SELECT * FROM users ORDER BY created_at DESC';
    const queryFeedback = 'SELECT * FROM feedback ORDER BY created_at DESC';
    const queryComments = 'SELECT * FROM comments ORDER BY created_at DESC LIMIT 50';

    db.query(queryUsers, (err, users) => {
        if (err) return res.status(500).json({ message: 'Error' });
        db.query(queryFeedback, (err2, feedback) => {
            if (err2) return res.status(500).json({ message: 'Error' });
            db.query(queryComments, (err3, comments) => {
                if (err3) return res.status(500).json({ message: 'Error' });
                res.json({
                    adminName: req.session.user.username,
                    totalUsers: users.length,
                    users, feedback, comments
                });
            });
        });
    });
});

// ==============================================
// 7. START SERVER
// ==============================================
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});