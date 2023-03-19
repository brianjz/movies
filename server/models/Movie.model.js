import { Decimal128 } from 'mongodb'
import { Schema, model } from 'mongoose'

function getDecimal(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};

const movieSchema = new Schema({
   chosenBy: String,
   added: { type: Date, default: Date.now },
   watched: [Date],
   adult: Boolean,
   backdrop_path: String,
   belongs_to_collection: {
        id: Number,
        name: String,
        poster_path: String,
        backdrop_path: String
   },
   budget: Number,
   genres: [{id: Number, name: String}],
   homepage: String,
   id: Number,
   imdb_id: String,
   original_language: String,
   original_title: String,
   overview: String,
   popularity: { 
        type: Decimal128,
        default: 0,
        get: getDecimal
    },
   poster_path: String,
   production_companies: [{id: Number, logo_path: String, name: String, origin_county: String}],
   production_countries: [{iso_3166_1: String, name: String}],
   release_date: String,
   revenue: Number,
   runtime: Number,
   spoken_languages: [{english_name: String, iso_639_1: String, name: String}],
   status: String,
   tagline: String,
   title: String,
   video: Boolean,
   vote_average: { 
    type: Decimal128,
    default: 0,
    get: getDecimal
    },
   vote_count: Number,
   lastWatched: { type: Date }
}, {toJSON: {getters: true}})

const Movie = model('Movie', movieSchema)

export default Movie
