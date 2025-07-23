const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const { connectToDb } = require('./config/database');
const { User } = require('./models/user')
const { signUpValidator } = require('./utils/validators/sign-up-validators');
const { loginValidators } = require('./utils/validators/login-validators');
const { PORT, SECRET_KEY } = require('./constants/constants');
const { isUserExist, getAllUsers, getUserById } = require('./utils/user/user');
const { authMiddleware } = require('./middlewares/auth-middleware');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    signUpValidator(firstName, lastName, emailId, password);
    const hashedPassword = await bcrypt.hash(req.body?.password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    user.password = hashedPassword;
    const userResponse = await user.save();
    res.send('User added successfully: ' + userResponse._id);
  }
  catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    loginValidators(emailId, password);
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error('Invalid credentials');
    const isValidPassword = await user.isPasswordValid(password);
    if (isValidPassword) {
      const token = await user.addJwtToken();
      res.cookie('token', token);
      res.send('Login Successfull');
    }
    else res.send('Invalid credentials');
  }
  catch (error) {
    res.status(400).send('Error: ' + error);
  }

})

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

