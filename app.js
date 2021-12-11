const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERR_NOT_FOUND } = require('./errors/statusCode');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '61b3718e2cce7e166886997a',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(ERR_NOT_FOUND).send({ message: 'Данная страница не существует' });
});

app.listen(PORT);
