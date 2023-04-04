import axios from 'axios'
import { useLoaderData } from 'react-router'
import MovieList from '../components/MovieList'

export async function loader({ searchTerm = '', sort = '' }) {
    let movies = []
    const url = searchTerm || sort ? `/api/movies?search=${searchTerm}&sort=${sort}` : '/api/movies'
    console.log('getMovies: ', url)
    await axios.get(url)
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