import { useState } from "react";
import axios from 'axios'
// import { findData } from '../testdata/testData'
import MovieList from "../components/MovieList";

const AddMovie = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [existingMovies, setExistingMovies] = useState([])

    async function getMovies(newSearchTermItem) {
        const newSearchTerm = newSearchTermItem.searchTerm || ''
        if(searchTerm !== newSearchTerm) {
            if(newSearchTerm === '') {
                setExistingMovies([]);
                setSearchTerm('');
            } else {
                const escST = newSearchTerm.replace(' ', '+')
                setSearchTerm(newSearchTerm)
                return new Promise((resolve, reject) => {
                    axios.get(`/api/movies/find/${escST}`)
                    .then((response)=>{
                        setExistingMovies(response.data.existing)
                        resolve(response.data.results);
                    })
                    .catch((error) => {
                        console.log(error)
                        reject(error)
                    })
                })
                //-- testing
                // return findData.results
            }
        }
    }

    return (
        <>
        <h1 className="page-header">Add Movie</h1>

        <div>
            <MovieList 
                add={true} 
                existing={existingMovies} 
                getMovies={getMovies}
                page="AddMovies"
            />
        </div>
        </>
    )

}

export default AddMovie;