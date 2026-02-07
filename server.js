require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
app.set('trust proxy', 1);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const port = process.env.PORT || 3000;

// === MIDDLEWARE ===
app.use(cors({ origin: true, credentials: true }));
app.use(express.static(path.join(__dirname, '/')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

// === DATABASE ===
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
    if (err) console.error('❌ DB Connection Failed:', err.message);
    else console.log('✅ Connected to MySQL database');
});

// === AUTH  ===
app.post('/auth/register', async (req, res) => {
    const { username, email, phone, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, email, phone, password_hash) VALUES (?, ?, ?, ?)', 
        [username, email, phone, hash], (err) => {
            if (err) return res.status(500).json({ message: 'Error registering' });
            res.json({ message: 'Success' });
        });
    } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) { return res.status(500).json({ message: 'Database error' });}
        if (results.length === 0) { return res.status(404).json({ message: 'Email not registered' }); }
        const user = results[0];
        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error checking password' });
            if (!isMatch) { return res.status(401).json({ message: 'Incorrect password' }); }
            req.session.user = user;
            req.session.save(() => { res.json({ message: 'Login successful', role: user.role }); });
        });
    });
});

app.post('/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

app.get('/auth/me', (req, res) => {
    if (!req.session.user) return res.json({ loggedIn: false });
    res.json({ loggedIn: true, user: req.session.user });
});

app.post('/auth/reset-with-phone', async (req, res) => {
    const { email, phone, newPassword } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const user = results[0];

        if (user.phone !== phone) {
            return res.status(401).json({ message: 'Incorrect phone number' });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
        
        if (isSamePassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        db.query('UPDATE users SET password_hash = ? WHERE email = ?', [hashedPassword, email], (err) => {
            if (err) return res.status(500).json({ message: 'Error updating password' });
            
            res.status(200).json({ message: 'Password reset successful' });
        });
    });
});

// === USER & DATA ===
app.post('/auth/update', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
    const { username, phone, favorite_episode, avatar_id } = req.body;
    const sql = `UPDATE users SET username=COALESCE(?, username), phone=COALESCE(?, phone), favorite_episode=COALESCE(?, favorite_episode), avatar_id=COALESCE(?, avatar_id) WHERE id=?`;
    db.query(sql, [username, phone, favorite_episode, avatar_id, req.session.user.id], (err) => {
        if(err) return res.status(500).json({message:'Error'});
        if(username) req.session.user.username = username;
        if(avatar_id) req.session.user.avatar_id = avatar_id;
        if(favorite_episode) req.session.user.favorite_episode = favorite_episode;
        req.session.save(() => res.json({ message: 'Updated' }));
    });
});

app.post('/user/progress', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
    const { season, episode } = req.body;
    db.query(`INSERT INTO watch_history (user_id, season, episode) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE season=VALUES(season), episode=VALUES(episode)`, 
    [req.session.user.id, season, episode], () => res.json({ success: true }));
});

app.get('/user/progress', (req, res) => {
    if (!req.session.user) return res.json({ continue: null });
    db.query('SELECT season, episode FROM watch_history WHERE user_id = ?', [req.session.user.id], (err, r) => {
        res.json({ continue: r.length ? r[0] : null });
    });
});

// === CONTENT ===
app.get('/anime', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Please login' }); 
    db.query("SELECT * FROM anime_episodes ORDER BY season, episode", (err, results) => {
        if (err) return res.status(500).json({ message: "DB Error" });
        const data = results.map(row => ({
            season: row.season,
            episode_number: row.episode,
            title: `Season ${row.season} - Episode ${row.episode}`,
            description: "",
            video_link: row.drive_link
        }));
        res.json(data);
    });
});

app.get('/manga', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Please login' }); 
    db.query('SELECT * FROM manga_chapters ORDER BY chapter_number ASC', (err, results) => {
        // res.json(results || []);
        if (err) return res.status(500).json({ message: "DB Error" });
        const data = results.map(row => ({
            chapter: row.chapter_number,
            title: `Chapter ${row.chapter_number}`,
            description: "",
            pdf_link: row.drive_link
        }));
        res.json(data);
    });
});

app.get('/comments', (req, res) => {
    const { season, episode } = req.query;
    let sql = 'SELECT * FROM comments ORDER BY created_at DESC';
    let params = [];
    if(season && episode) { sql += ' WHERE season=? AND episode=?'; params=[season, episode]; }
    db.query(sql, params, (err, r) => res.json(r || []));
});

app.post('/comments', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Login required' });
    const { text, season, episode } = req.body;
    db.query('INSERT INTO comments (username, comment_text, season, episode) VALUES (?, ?, ?, ?)', 
    [req.session.user.username, text, season, episode], () => res.json({ success: true }));
});

// === FEEDBACK  ===
app.post('/feedback', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Login required to give feedback' });
    
    const { name, email, message } = req.body;
    db.query('INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)', [name, email, message], () => res.json({ success: true }));
});

// === ADMIN ===
app.get('/admin/data', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).json({ message: 'Denied' });
    db.query('SELECT * FROM users', (e, users) => {
        db.query('SELECT * FROM feedback', (e, fb) => {
            db.query('SELECT * FROM comments', (e, cm) => {
                res.json({ adminName: req.session.user.username, totalUsers: users.length, users, feedback: fb, comments: cm });
            });
        });
    });
});

app.delete('/admin/delete-user/:id', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).json({ message: 'Denied' });
    if (parseInt(req.params.id) === req.session.user.id) return res.status(400).json({ message: "Cannot delete self" });
    db.query('DELETE FROM users WHERE id=?', [req.params.id], () => res.json({ success: true }));
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));