require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const MovieData = require('./movie-data-small.json');
//need to require helmet & cors later
const app = express();

app.use(morgan('dev'));
app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN;

  console.log('validate bearer token middleware');
  
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request'});
  }
  next();
});


//endpoint is GET /movie

const HandleGetMovies = (req, res) => {
  res.json('Hello');
};
// Users can search for Movies by genre, country or avg_vote

app.get('/movie', HandleGetMovies);

//The endpoint only responds when given a valid Authorization header with a Bearer API token value.

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
})
