const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const errorHandler = require('./middleware/error.middleware')
const connectDatabase = require('./config/database.config');
const log = require('./config/log4js.config');

connectDatabase();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  log.info('User connected to server', req.headers);
  res.send({success: true, message: 'User connected to server'});
});

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/party', require('./routes/party.route'));
app.use('/api/user', require('./routes/user.route'));

app.use(errorHandler);


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  log.info(`Server has been started on PORT=${PORT}`);
});

process.on("unhandledRejection", (err) => {
  log.error(`Logged error: ${err.message}`);
  server.close(() => process.exit(1));
});
