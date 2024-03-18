const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Heroku sets this environment variable
  ssl: {
    rejectUnauthorized: false // Note: only use this for Heroku's free tier
  }
});

app.post('/login', async (req, res) => {
  const { accessToken } = req.body;
  try {
    const result = await pool.query('INSERT INTO users(accessToken) VALUES($1) RETURNING *', [accessToken]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/users', async (req, res) => {
  const { accessToken } = req.body;
  try {
    const result = await pool.query('INSERT INTO users(accessToken) VALUES($1) RETURNING *', [accessToken]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
