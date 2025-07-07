const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'testdivdatabase-canada.cfg84o02o0vb.ca-central-1.rds.amazonaws.com',
  database: 'SampleDBForCanada',
  password: 'x6KJ4=+7',
  port: 5432,
});

app.post('/insertBatch', async (req, res) => {
  const {records,object} = req.body;
const objName = ''+object; 
  if (!records || !object || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ error: 'No records provided' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const record of records) {
      const keys = Object.keys(record); // dynamic field names
      const values = Object.values(record); // dynamic field values
      const columns = keys.map(k => k.toLowerCase()).join(', ');
      console.log('test::::::  ');
     // const columns = keys.map(k => `"${k}"`).join(', '); // wrap columns in quotes to support __c
      const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', '); // $1, $2, $3...
      console.log('object:: '+object);
      const query = `INSERT INTO ${objName} (${columns}) VALUES (${placeholders})`;

      await client.query(query, values);
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'All records inserted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error inserting batch:', error);
    res.status(500).json({ error: 'Failed to insert records', details: error.message });
  } finally {
    client.release();
  }
});

app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
