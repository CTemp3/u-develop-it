// personal reminder notes
/* 
Q. What does /api refer to?
A. It indicates that this route is an api endpoint. What that means is that this route is essentially tagged to serve up information to a client
whenever the /api/(whatever) is called. For instance, if I run the server on my machine and then navigate to localhost/api/quadratic in a browser, 
the server knows to perform whatever request is connected to /api/quadratic.
*/

// external requirements and baseline declarations
const express = require('express');
const app = express();
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

// port config
const PORT = process.env.PORT || 3001;

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to mysql db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'mysqldummy',
        password: 'mysqldummypassword',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// GET all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// DELETE a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({ message: 'Candidate not found' });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// CREATE a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// routing content


// Default response for invalid requests (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// server startup
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});