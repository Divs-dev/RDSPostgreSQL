const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
app.use(bodyParser.json());
// Replace with your actual RDS PostgreSQL credentials
const pool = new Pool({
  user: 'your_pg_user',
  host: 'your-rds-endpoint.amazonaws.com',
  database: 'your_db_name',
  password: 'your_password',
  port: 5432,
});
app.post('/insert', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO contacts (name, email) VALUES ($1, $2)',
      [name, email]
    );
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting data' });
  }
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
