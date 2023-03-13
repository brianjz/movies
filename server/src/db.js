import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
const result = dotenv.config()

// console.log(process.env.NODE_ENV)
const CONN_STRING = process.env.DB_CONN_STRING;

let db;

async function connectToDb(cb) {
    try {
        const client = new MongoClient(CONN_STRING, { useUnifiedTopology: true } );
        await client.connect();

        db = client.db('movies');
        console.log('DB connected');
        CONN_STRING.indexOf('127.0.0.1') > -1 && console.log('--> Local DB');
    } catch(e) {
        console.error(e);
    }
    cb();
}

export {
    db,
    connectToDb
};