// external requirements and baseline declarations
const express = require('express');
const app = express();

// port config
const PORT = process.env.PORT || 3001;

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routing content


// Default response for invalid requests (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// server startup
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});