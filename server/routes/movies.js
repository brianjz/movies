import express from 'express'
import { db } from '../src/db.js';
import { MovieDb } from 'moviedb-promise'

const moviedb = new MovieDb('c208329e8399e97f9b5efb99b3be1313')
const movieRouter = express.Router();
const pageLength = 25;

movieRouter.get('/:page(\\d+)?', async function(req, res) {
    const page = req.params.page;
    const sort = req.query.sort;
    const search = req.query.search;
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
    const searchQuery= search ? { title: new RegExp(search, 'i') } : {}

    const coll = db.collection('movies')
    const records = await db.collection('movies').find(
        searchQuery, { 
            sort: sortData,
            limit: pageLength,
            skip: offset
        }
    ).toArray();

    records.map((rec) => {
        if(!rec.lastWatched) {
            rec.lastWatched = new Date('1900-01-01')
        }
    })
    // const records = await cursor.toArray();
    // console.log(records)
    const total = await db.collection('movies').count(searchQuery);

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

movieRouter.get('/find/:title?', async function(req, res) {
    const { title } = req.params;
    if(title) {
        moviedb
            .searchMovie({ query: title, include_adult: false, region: 'US' })
            .then(async (response) => {
                const movieIds = []
                response.results.map((movie) => {
                    movieIds.push(movie.id)
                })
                const existingMoviesArray = await db.collection('movies').find(
                    { id: { $in: movieIds } },
                    { sort: { id: 1 }})
                    .project({ id: 1, _id: 0 })
                .toArray();
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
    console.log(movie)

    try {
        const newRecord = await db.collection('movies').insertOne(movie);
    } catch(e) {
        res.send({updated: false, error: e.message})
    }

    res.send({updated: true});
});


export default movieRouter;