const express = require('express');
const cookieParser = require('cookie-parser');

const { connectToDb } = require('./config/database');
const { PORT } = require('./constants/constants');
const { authRouter } = require('./router/auth');
const { profileRouter } = require('./router/profile');
const { userRouter } = require('./router/user');
const { feedRouter } = require('./router/feed');
const { requestRouter } = require('./router/request');

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', userRouter);
app.use('/', feedRouter);
app.use('/', requestRouter);

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

