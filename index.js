const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
app.use(bodyParser.json());
// Replace with your actual RDS PostgreSQL credentials
const pool = new Pool({
  user: 'postgres',
  host: 'testdivdatabase-canada.cfg84o02o0vb.ca-central-1.rds.amazonaws.com',
  database: 'SampleDBForCanada',
  password: 'x6KJ4=+7',
  port: 5432,
});
app.post('/insert', async (req, res) => {
  const { Id, Name, Field_Name__c, Action__c, Account__c, Lead__c, Funding__c, New_Value__c, Old_Value__c, CreatedDate, user__c } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO funding_flow (Id, Name, Field_Name__c, Action__c, Account__c, Lead__c, Funding__c, New_Value__c, Old_Value__c, CreatedDate, user__c) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [Id, Name, Field_Name__c, Action__c, Account__c, Lead__c, Funding__c, New_Value__c, Old_Value__c, CreatedDate, user__c]
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
