const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERR_NOT_FOUND } = require('./errors/statusCode');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(ERR_NOT_FOUND).send({ message: 'Данная страница не существует' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.listen(PORT);
