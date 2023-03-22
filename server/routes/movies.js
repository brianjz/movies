import express from 'express'
import { MovieDb } from 'moviedb-promise'

import Movie from '../models/Movie.model.js';

const moviedb = new MovieDb('c208329e8399e97f9b5efb99b3be1313')
const movieRouter = express.Router();
const pageLength = 25;

// movieRouter.get('/:page(\\d+)?', async function(req, res) {
movieRouter.get('/', async function(req, res) {
    const page = req.params.page;
    console.log(`Called ==> /`);
    const sort = req.query.sort;
    const search = req.query.search;
    // let offset = 0;
    // if(page && page > 0) {
    //     offset = pageLength * (page - 1);
    // }

    let sortData = { title: 1 };
    if(sort) {
        sortData = {};
        sortData[sort] = 1;
        if(req.query.direction) {
            sortData[sort] = req.query.direction;
        }
        if(sort != 'date') {
            sortData['date'] = 1;
        }
    }
    // console.log(sortData);
    const searchQuery= search ? { title: new RegExp(search, 'i') } : {}

    let total = 0
    const records = Movie.find(
        searchQuery, null, { 
            sort: sortData
        }
    ).then(async (records) => {
        records.map((rec) => {
            if(!rec.lastWatched) {
                rec.lastWatched = new Date('1900-01-01')
            }
        })
        total = await Movie.estimatedDocumentCount(searchQuery)
        res.send({movies: records, total: total})
    })
})

movieRouter.get('/getMovie/:movieId(\\d+)', async function(req, res) {
    const { movieId } = req.params
    console.log('Called ==> /getMovie/' + movieId);

    // Check for existing object in database
    Movie.find(
        { id: parseInt(movieId) }
    ).then((existingMovie) => {
        // if not found, pull from API and save it
        if(existingMovie.length === 0) {
            console.log('Calling tMDB API --> ', movieId)
            const movie = {};
            moviedb
            .movieInfo({ id: movieId })
            .then((movie) => {
                // add local fields
                movie.chosenBy = ""
                movie.added = new Date()
                // db.collection('movies').replaceOne(curId, movie, { upsert: true })
                res.send(movie);
            })
            .catch(e => console.error(e));    
        } else {
            res.send(existingMovie[0]);
        }
    })

})

movieRouter.get('/find/:title?', async function(req, res) {
    const { title } = req.params;
    console.log('Called ==> /find/' + title);
    if(title) {
        moviedb
            .searchMovie({ query: title, include_adult: false, region: 'US' })
            .then(async (response) => {
                const movieIds = []
                response.results.map((movie) => {
                    movieIds.push(movie.id)
                })
                const existingMoviesArray = await Movie.find(
                    { id: { $in: movieIds } }, 'id', { sort: { id: 1 }})
                    // .project({ id: 1, _id: 0 })
                const existingMovies = existingMoviesArray.flatMap((elem) => elem.id)
                response.existing = existingMovies
                res.send(response)
            })
            .catch(console.error)
    } else {
        res.send([])
    }
})

movieRouter.put('/addMovie', async (req, res) => {
    const movie = req.body;
    console.log('Called ==> /addMovie');

    try {
        const newRecord = await Movie.create(movie).then(res.send({updated: true}))
    } catch(e) {
        res.send({updated: false, error: e.message})
    }
});

movieRouter.post('/update/:id', (req, res) => {
    console.log('Called ==> /update/' + req.params.id);

    Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedMovie => res.status(200).json({ successMessage: 'Updated Successfully!', movie: updatedMovie }))
      .catch(err => res.json({ failureMessage: 'Failed to update movie.', error: err }));
  });
  


export default movieRouter;