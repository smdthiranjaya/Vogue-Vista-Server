const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Note: only use this for Heroku's free tier
  }
});

app.post('/login', async (req, res) => {
  const { email, name, pictureURL, auth0Id } = req.body; // Adjust according to the actual data sent from your client
  try {
    const result = await pool.query(
      'INSERT INTO users(email, name, picture_url, auth0_id) VALUES($1, $2, $3, $4) RETURNING *',
      [email, name, pictureURL, auth0Id]
    );
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
