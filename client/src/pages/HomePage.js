import axios from 'axios'
import { useLoaderData } from 'react-router'
import MovieList from '../components/MovieList'

export async function loader() {
    let movies = []
    await axios.get(`/api/movies`)
    .then((response)=>{
        movies =  response.data
    })
    .catch((error) => {
        console.log(error)
    })

    return movies;
}

const HomePage = () => {
    const { movies } = useLoaderData()
    console.log(movies)
    return (
        <MovieList movies={movies} />
    )

}

export default HomePage;