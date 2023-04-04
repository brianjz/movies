import MovieListItem from "./MovieListItem";
import styled from 'styled-components';
import { useState, useEffect, useRef } from "react";
import SearchTools from "./SearchTools";
import axios from "axios";
import { Modal } from "./Modal";
import MovieDetails from "./MovieDetails";
import { confirm } from "./Confirmation";

const StyledMovieList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const MovieList = (props) => {
    const { movies, add, getMovies } = props
    const existing = props.existing || []
    const defaultSorting = props.defaultSorting || '-vote_average'

    const [searchTerm, setSearchTerm] = useState('')
    const [showClear, setShowClear] = useState(false)
    const [finalSearchTerm, setFinalSearchTerm] = useState({})
    const [sortBy, setSortBy] = useState(props.defaultSorting)
    const [curMovieList, setCurMovieList] = useState(movies)
    const [hideWatched, setHideWatched] = useState(false)
    const [chosenMovie, setChosenMovie] = useState({})
    const [showModal, setShowModal] = useState(false)

    const movieList = useRef(movies)

    const handleSearchTerm = (event) => {
        setSearchTerm(event.target.value)
        if(event.target.value === '')
            setShowClear(true)
    }

    const handleSearchSubmit = (event) => {
        if(event === 'clear') {
            setFinalSearchTerm({})
        } else {
            event.preventDefault();
            if(searchTerm !== finalSearchTerm) {
                setFinalSearchTerm({searchTerm: searchTerm})
            }
        }
    }

    const handleSortBy = (event) => {
        setSortBy(event.target.value);
    }

    const handleClearSearch = () => {
        setSearchTerm('')
        handleSearchSubmit('clear')
    }

    const handleHideWatched = (event) => {
        event.preventDefault()
        let filteredList = [];
        if(!hideWatched) {
            filteredList = curMovieList.filter((movie) => {
                return movie.watched.length <= 0
            })
        } else {
            setFinalSearchTerm({}) // reload list
        }
        setHideWatched(!hideWatched)
        setCurMovieList(filteredList)
        movieList.current = filteredList
    }

    const handleMovieClick = (event, movieId) => {
        event.preventDefault()
        let movie = {}
        axios.get(`/api/movies/getMovie/${movieId}`)
            .then((response)=>{
                movie = response.data
                setChosenMovie(movie)
                setShowModal(true)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleMovieDelete = async (event, movieId) => {
        event.preventDefault();

        if(await confirm("Are you sure?")) {
            axios.delete(`/api/movies/delete/${movieId}`)
            .then((response) => {
                const newList = curMovieList.filter((item) => item.id !== movieId);
                setCurMovieList(newList)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }

    const updateMovie = async (id) => {
        // let updatedList = []
        // const updatedList = await Promise.all(movieList.current.map(async (m) => {
        //     if(m.id === id) {
        //         await axios.get(`/api/movies/getMovie/${id}`)
        //         .then((response)=>{
        //             return response.data
        //         })
        //         .catch((error) => {
        //             console.log(error)
        //         })
        //     } else {
        //         return m
        //     }
        // }))

        // movieList.current = updatedList
        setShowModal(false)
        // setCurMovieList(updatedList)
    }

    const moviesLoaded = useRef(false);
    useEffect(() => {
        const handleSorting = (origData) => {
            if(sortBy) {
                if(sortBy[0] === '-') {
                    const sort = sortBy.substring(1)
                    if (origData.find(x => typeof x[sort] !== 'number')) 
                        return [...origData].sort((a,b) => b[sort].localeCompare(a[sort]))
                    else
                        return [...origData].sort((a,b) => b[sort] - a[sort])
                } else {
                    if (origData.find(x => typeof x[sortBy] !== 'number')) 
                        return [...origData].sort((a,b) => a[sortBy].localeCompare(b[sortBy]))
                    else
                        return [...origData].sort((a,b) => a[sortBy] - b[sortBy])
                }
            } else {
                return origData
            }
        }
        
        if(movieList.current) {
            moviesLoaded.current = true
            const sortedList = handleSorting(movieList.current)
            movieList.current = sortedList
            setCurMovieList(sortedList)
        }
    }, [sortBy])

    useEffect(() => {
        const getNewMovies = async () => {
            await getMovies({ sort: sortBy, ...finalSearchTerm})
                .then((newMovieList) => {
                    movieList.current = newMovieList
                    setCurMovieList(newMovieList)
                    if(sortBy === '') {
                        setSortBy(defaultSorting) // default sort, needs to be here to fire off sort logic
                    }
                })
        }
        if(moviesLoaded.current) {
            getNewMovies()
        } else {
            moviesLoaded.current = true
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finalSearchTerm])

    return (
        <>
        <SearchTools 
            onSortBy={handleSortBy} 
            onSearchChange={handleSearchTerm} 
            onSearchSubmit={handleSearchSubmit} 
            onClearSearch={handleClearSearch}
            curSort={sortBy} 
            curSearchTerm={searchTerm}
            showClear={showClear}
            onHideWatched={handleHideWatched}
            curHideWatched={hideWatched}
            page={props.page}
        />
        {(curMovieList && curMovieList.length > 0) ?
            <StyledMovieList>
            {curMovieList.map((movie) => {
                return (
                    <MovieListItem 
                        key={movie.id} 
                        movie={movie} 
                        showAdd={add} 
                        isInCollection={existing.includes(movie.id) ? true : false} 
                        onMovieClick={handleMovieClick} 
                        onDelete={handleMovieDelete}
                    />
                )
            })}
            </StyledMovieList>
            : "No Movies Found"
        }
        <Modal shouldShow={showModal} onRequestClose={() => updateMovie(chosenMovie.id)} children={<MovieDetails movie={chosenMovie} />}/>
        </>
    )
}

export default MovieList;