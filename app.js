const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middleware/error.middleware')

const connectDatabase = require('./config/database.config');

connectDatabase().then(() => {
  const app = express();

  app.use(bodyParser.json())
  app.use(cors)

  app.get('/', (req, res) => {
    res.send('API IS RUNNING');
  });

  app.use('/api/auth', require('./routes/auth.route'));
  app.use('/api/party', require('./routes/party.route'));

  app.use(errorHandler)

  const PORT = process.env.PORT || 80;

  const server = app.listen(PORT, () => {
    console.log(`Server has been started on PORT=${PORT}`);
  });

  process.on("unhandledRejection", (err) => {
    console.log(`Logged error: ${err.message}`);
    server.close(() => process.exit(1));
  });
}).catch((err) => console.log(err.message));
