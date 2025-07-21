const express = require('express');
const { connectToDb } = require('./config/database');
const { User } = require('./models/user')
const { signUpValidator } = require('./utils/validators/sign-up-validators');

const app = express();
const PORT = 7777;

app.use(express.json());

app.post('/signup', async (req, res) => {
  try {
    signUpValidator(req.body?.firstName, req.body?.lastName, req.body?.emailId, req.body?.password);
    const user = new User(req.body);
    const userResponse = await user.save();
    res.send('User added successfully: ' + userResponse._id);
  }
  catch (error) {
    res.status(400).send('Error occured while saving the user: '+ error.message);
  }
});

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

