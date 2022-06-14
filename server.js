/* eslint-disable linebreak-style */
const express = require('express');
const bodyParser = require('body-parser');
const mongoDb = require('mongoose');
const auth = require('./route/auth')
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use('/auth', auth);


const { PORT, DBURL } = process.env;
mongoDb.connect(DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoDb.connection;
db.on('err', console.error.bind('thier is a connection err'));

app.listen(PORT, () => {
  console.log(`app is running at port:${PORT}`);
});

