import express from 'express';
import path from 'path';
import { db } from './db.js';
import  { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import indexRouter from '../routes/index.js'
import movieRouter from '../routes/movies.js';

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/movies', movieRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

// --- SERVER ---
const PORT = process.env.PORT || 8018;
// connectToDb(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
// });
