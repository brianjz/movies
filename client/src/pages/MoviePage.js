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

    const handleJustWatched = async (value) => {
        const newDate = new Date(value + ' 12:00:00') || new Date()
        console.log(value, newDate)
        const updatedMovie = {...movie, lastWatched: newDate, watched: [...movie.watched, newDate]}
        await axios.post(`/api/movies/update/${movie._id}`, updatedMovie)
        console.log(updatedMovie)
    }

    return (
        <MovieDetails movie={movie} onChangeChosenBy={handleChosenByUpdate} onJustWatched={handleJustWatched} />
    )
}

export default MoviePage;