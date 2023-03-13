import express from 'express'
import { db } from '../src/db.js';
import { MovieDb } from 'moviedb-promise'

const moviedb = new MovieDb('c208329e8399e97f9b5efb99b3be1313')
const movieRouter = express.Router();
const pageLength = 25;

movieRouter.get('/:page(\\d+)?', async function(req, res) {
    const page = req.params.page;
    const sort = req.query.sort;
    let offset = 0;
    if(page && page > 0) {
        offset = pageLength * (page - 1);
    }

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

    const records = await db.collection('movies').find(
        {}, { 
            sort: sortData,
            limit: pageLength,
            skip: offset
        }
    ).toArray();
    const total = await db.collection('movies').count();

    res.send({movies: records, total: total});
})

movieRouter.get('/getMovie/:movieId(\\d+)', async function(req, res) {
    const { movieId } = req.params

    // Check for existing object in database
    const existingMovie = await db.collection('movies').find(
        { id: parseInt(movieId) }
    ).toArray();

    // if not found, pull from API and save it
    if(existingMovie.length === 0) {
        console.log('Calling tMDB API --> ', movieId)
        const movie = {};
        moviedb
        .movieInfo({ id: movieId })
        .then(movie => {
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

movieRouter.get('/find/:title', function(req, res) {
    const { title } = req.params;
    moviedb
        .searchMovie({ query: title })
        .then((response) => {
            res.send(response)
        })
        .catch(console.error)
})

export default movieRouter;