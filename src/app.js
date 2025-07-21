const express = require('express');
const { connectToDb } = require('./config/database');
const { User } = require('./models/user')

const app = express();
const PORT = 7777;

app.use(express.json());

app.post('/signup', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send('User added successfully');
  }
  catch (err) {
    res.status(400).send('Error occured while saving the user: ');
  }
});

app.get('/user', async (req, res) => {
  try {
    const user = await User.findById(req.body?.userId);
    res.send(user);
  }
  catch (error) {
    res.status(400).send('Something went wrong in fetching user by id');
  }
});

app.get('/user', async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailId });
    res.send(users[0]);
  }
  catch (error) {
    res.status(400).send("Something went wrong in fetching user by email id: ");
  }
});

app.delete('/user', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body?.userId);
    res.send(user);
  }
  catch (error) {
    res.status(400).send('Something went wrong in deleting the user by id');
  }
});

app.patch('/user', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body?.userId, req.body)
    res.send(user);
  } 
  catch (error) {
    res.status(400).send('Something went wrong in updating the user');
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  }
  catch (error) {
    res.status(400).send("Something went wrong in fetching all the users");
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

