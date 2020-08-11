require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MovieData = require('./movie-data-small.json');
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;

  console.log('validate bearer token middleware');
  
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request'});
  }
  next();
});

const HandleGetMovies = (req, res) => {
  let { genre, country, avg_vote } = req.query;
  let response = [...MovieData];

  if (genre) {
    genre = genre.toLowerCase();
    response = response.filter(movie => movie.genre.toLowerCase().includes(genre));
  }
  
  if (country) {
    country = country.toLowerCase();
    response = response.filter(movie => movie.country.toLowerCase().includes(country));
  }  

  if (avg_vote) {
    let vote = parseFloat(avg_vote);
    if(vote < 0 || vote > 10) {
      res.status(401).json({ error: 'Provide a number between 0 and 10'});
    }

    if (Number.isNaN(vote)) {
      res.status(401).json({ error: 'Expected a number' })
    }
    
    response = response.filter(movie => movie.avg_vote >= vote);
  }
  res.json(response);
};

app.get('/movie', HandleGetMovies);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
})
