import mongoose from 'mongoose'

const dbconn = process.env.MONGODB_URI || 'mongodb://127.0.0.1/movies'
export const db = mongoose
  .connect(dbconn, {
    useUnifiedTopology: true,
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error(`Error connecting to mongo: ${err}`));
