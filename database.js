const mongoose = require('mongoose');
const consts = require('./consts');

const { DB_HOST, DB_USER, DB_PASS } = consts;
const url = DB_HOST;
const options = {
  useNewUrlParser: true, 
  useCreateIndex: true, 
  useUnifiedTopology: true, 
  user: DB_USER,
  pass: DB_PASS
};

mongoose
  .connect(url, options)
  .then(() => console.log('Connected to mongoDB'))
  .catch(err => console.log(`Error connecting to mongoDB: ${err}`));
