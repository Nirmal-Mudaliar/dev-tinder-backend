const express = require('express');
const { connectToDb } = require('./config/database');
const { User } = require('./models/user')

const app = express();
const PORT = 7777;

connectToDb()
  .then(() => {
    console.log('Database connection established');

    app.listen(PORT, () => {
      console.log(`Server is successfully listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error occured while connecting to database: ', error);
  })

