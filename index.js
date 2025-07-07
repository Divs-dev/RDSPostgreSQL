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
  const records = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const record of records) {
      console.log('record>> '+record);
      const {
        Id,
        Name,
        Field_Name__c,
        Action__c,
        Account__c,
        Lead__c,
        Funding__c,
        New_Value__c,
        Old_Value__c,
        CreatedDate,
        user__c
      } = record;
      await client.query(
        `INSERT INTO funding_flow
        (Id, Name, Field_Name__c, Action__c, Account__c, Lead__c, Funding__c, New_Value__c, Old_Value__c, CreatedDate, user__c)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          Id,
          Name,
          Field_Name__c,
          Action__c,
          Account__c,
          Lead__c,
          Funding__c,
          New_Value__c,
          Old_Value__c,
          CreatedDate,
          user__c
        ]
      );
    }
    await client.query('COMMIT');
    res.status(200).json({ message: 'All records inserted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting batch:', error);
    res.status(500).json({ error: 'Failed to insert records' });
  } finally {
    client.release();
  }
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
