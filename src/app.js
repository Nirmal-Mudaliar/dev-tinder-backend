const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { connectToDb } = require('./config/database');
const { User } = require('./models/user')
const { PORT, SECRET_KEY } = require('./constants/constants');
const { isUserExist, getAllUsers } = require('./utils/user/user');
const { authMiddleware } = require('./middlewares/auth-middleware');
const { authRouter } = require('./router/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use('/', authRouter);

app.get('/user', async (req, res) => {
  try {
    const user = await User.findById(req.body?.userId);
    res.send(user);
  }
  catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

app.get('/user', async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailId });
    res.send(users[0]);
  }
  catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.delete('/user', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body?.userId);
    res.send(user);
  }
  catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

app.patch('/user', async (req, res) => {
  const ALLOWED_UPDATE_KEYS = ['userId', 'about', 'profileUrl'];
  const isAllowed = Object.keys(req.body).every((key) => ALLOWED_UPDATE_KEYS.includes(key));
  try {
    if (!isAllowed) throw new Error('Update is not allowed');
    const user = await User.findByIdAndUpdate(req.body?.userId, req.body);
    res.send(user);
  }
  catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
})

app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error('Invalid credentials');
    res.send(user);
  }
  catch (error) {
    res.send(400).send('Error: ' + error.message);
  }
})

app.get('/users', async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error('Invalid token');
    const { _id } = await jwt.verify(token, SECRET_KEY);
    const isExist = await isUserExist(_id);
    if (!isExist) throw new Error('Invalid token');
    const users = await getAllUsers();
    res.send(users);
  }
  catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

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

