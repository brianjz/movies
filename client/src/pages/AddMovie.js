import { useEffect, useState } from "react";
// import axios from 'axios'
import { findData } from '../testdata/testData'
import MovieList from "../components/MovieList";
import styled from 'styled-components'

const StyledSearch = styled.form`
    display: grid;
    grid-template-columns: 300px 300px max-content;
    gap: 10px;

    input[type=text], select {
        border-radius: var(--border-radius);
        border: 1px solid black;
        height: 50px;
        padding: 5px;
        font-size: 1.1rem;
    }

    input[type=submit] {
        background-color: var(--lower-blue);
        border: none;
        color: white;
        border-radius: var(--border-radius-button);
        font-size: 1.2rem;
        padding: 10px 20px;
        cursor: pointer;
    }
`;

const AddMovie = () => {
    const [movieList, setMovieList] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [finalSearchTerm, setFinalSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('title')
    // const [isLoading, setIsLoading] = useState(true)

    const handleSearchTerm = (event) => {
        setSearchTerm(event.target.value)
    }
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setFinalSearchTerm(searchTerm)
    }

    const handleSortBy = (event) => {
        setSortBy(event.target.value);
        setFinalSearchTerm(searchTerm)
        console.log('Sorting Change: ', event.target.value)
    }

    useEffect(() => {
        if(!finalSearchTerm) return;

        const fetchMovies = async () => {
            // const escST = finalSearchTerm.replace(' ', '+')
            // await axios.get(`/api/movies/find/${escST}`)
            // .then((response)=>{
            //     setMovieList(response.data)
            //     // setIsLoading(false)
            // })
            // .catch((error) => {
            //     console.log(error)
            // })
            console.log('Sorting: ', sortBy)
            const sortedData = [...findData.results].sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
            setMovieList(sortedData)
        }
        fetchMovies()
    }, [sortBy, finalSearchTerm])


    return (
        <>
        <h1 className="page-header">Add Movie</h1>
        <StyledSearch onSubmit={handleSearchSubmit}>
            <input type="text" name="searchBox" value={searchTerm} placeholder="Search for movie" onChange={handleSearchTerm}/>
            <select onChange={handleSortBy} value={sortBy}>
                <option value="release_date">Release Date</option>
                <option value="title">Title</option>
            </select>
            <input type="submit" value="Search" />
        </StyledSearch>
        <div>
            {movieList.results
                ? <MovieList movies={movieList.results} />
                : "No Movies Found."
            }
        </div>
        </>
    )

}

export default AddMovie;