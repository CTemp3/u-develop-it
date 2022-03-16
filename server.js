// external requirements and baseline declarations
const express = require('express');
const app = express();
const mysql = require('mysql2');

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

db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
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