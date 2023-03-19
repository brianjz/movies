import MovieDetails from "../components/MovieDetails";
import axios from 'axios'
import { useLoaderData } from "react-router";

export async function loader({ params }) {
    let movie = {}
    await axios.get(`/api/movies/getMovie/${params.movieId}`)
    .then((response)=>{
        movie = response.data
    })
    .catch((error) => {
        console.log(error)
    })

    return movie;
}

const MoviePage = () => {
    const movie = useLoaderData()

    const handleChosenByUpdate = async (value) => {
        const updatedMovie = {...movie, chosenBy: value}
        console.log('Calling', `/api/movies/update/${movie._id}`)
        await axios.post(`/api/movies/update/${movie._id}`, updatedMovie)
        // console.log(updatedMovie)
    }

    const handleJustWatched = async (e) => {
        const nowDate = new Date()
        const updatedMovie = {...movie, lastWatched: nowDate, watched: [...movie.watched, nowDate]}
        await axios.post(`/api/movies/update/${movie._id}`, updatedMovie)
        console.log(updatedMovie)
    }

    return (
        <MovieDetails movie={movie} onChangeChosenBy={handleChosenByUpdate} onJustWatched={handleJustWatched} />
    )
}

export default MoviePage;