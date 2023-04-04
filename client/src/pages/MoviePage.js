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

    return (
        <MovieDetails movie={movie} />
    )
}

export default MoviePage;