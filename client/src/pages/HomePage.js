import axios from 'axios'
import { useLoaderData } from 'react-router'
import MovieList from '../components/MovieList'

export async function loader(searchTerm = '') {
    let movies = []
    await axios.get(`/api/movies?search=${searchTerm}`)
    .then((response)=>{
        movies =  response.data.movies
    })
    .catch((error) => {
        console.log(error)
    })

    return movies;
}

const HomePage = () => {
    const movies = useLoaderData()
    return (
        <MovieList 
            movies={movies} 
            add={false} 
            getMovies={loader}
            defaultSorting="title"
            page="HomePage"
        />
)

}

export default HomePage;