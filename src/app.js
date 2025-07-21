const express = require('express');
const { connectToDb } = require('./config/database');
const { User } = require('./models/user')
const { signUpValidator } = require('./utils/validators/sign-up-validators');
const { loginValidators } = require('./utils/validators/login-validators');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 7777;

app.use(express.json());

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
    res.status(400).send('Error: '+ error.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    loginValidators(emailId, password);
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error('Invalid credentials');
    if (await bcrypt.compare(password, user.password)) {
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
    res.status(400).send('Something went wrong in fetching user by id: '+ error.message);
  }
});

app.get('/user', async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailId });
    res.send(users[0]);
  }
  catch (error) {
    res.status(400).send("Something went wrong in fetching user by email id: "+ error.message);
  }
});

app.delete('/user', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body?.userId);
    res.send(user);
  }
  catch (error) {
    res.status(400).send('Something went wrong in deleting the user by id: ' + error.message);
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
    res.status(400).send('Something went wrong in updating the user: ' + error.message);
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  }
  catch (error) {
    res.status(400).send("Something went wrong in fetching all the users" + error.message);
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

