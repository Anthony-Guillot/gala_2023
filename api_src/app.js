
const express = require('express');
const app = express();

const cors = require('cors')

app.use(cors({origin: "*"}))
app.options('*', cors({origin: "*"})) 

const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const scanRouter = require('./routes/scan');
const partyRouter = require('./routes/party');
const consumerRouter = require('./routes/consumer');
const consumableRouter = require('./routes/consumable');

app.use('/scan', scanRouter);
app.use('/party', partyRouter);
app.use('/consumer', consumerRouter);
app.use('/consumable', consumableRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('ENV') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({err : err.message}).send();
});

const port = process.env.PORT || '3000';

// app.set('port', port);

const {sync} = require('./model/bddTables');
sync()


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// module.exports = app;