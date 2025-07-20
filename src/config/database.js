const mongoose = require('mongoose');

const CONNECTION_URL = 'mongodb+srv://nirmalmudaliar22:CrWYhaxPLlowCPWk@devtinder.iyvbbqq.mongodb.net/dev-tinder';

const connectToDb = async () => {
  await mongoose.connect(CONNECTION_URL);
}

module.exports = {
  connectToDb: connectToDb
};