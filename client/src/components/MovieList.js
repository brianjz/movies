import MovieListItem from "./MovieListItem";
import styled from 'styled-components';
import { useState, useEffect, useRef } from "react";
import SearchTools from "./SearchTools";

const StyledMovieList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const MovieList = (props) => {
    const { movies, add, getMovies } = props
    const existing = props.existing || []
    const defaultSorting = props.defaultSorting || '-popularity'
    const [searchTerm, setSearchTerm] = useState('')
    const [showClear, setShowClear] = useState(false)
    const [finalSearchTerm, setFinalSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('')
    const [curMovieList, setCurMovieList] = useState(movies)
    const movieList = useRef(movies)

    const handleSearchTerm = (event) => {
        setSearchTerm(event.target.value)
        if(event.target.value === '')
            setShowClear(true)
    }

    const handleSearchSubmit = (event) => {
        if(event === 'clear') {
            setFinalSearchTerm('')
        } else {
            event.preventDefault();
            if(searchTerm !== finalSearchTerm) {
                setFinalSearchTerm(searchTerm)
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
            // if(finalSearchTerm) {
                await getMovies(finalSearchTerm)
                    .then((newMovieList) => {
                        movieList.current = newMovieList
                        setCurMovieList(newMovieList)
                        if(sortBy === '') {
                            setSortBy(defaultSorting) // default sort, needs to be here to fire off sort logic
                        }
                    })
            // }
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
            page={props.page}
        />
        {(curMovieList && curMovieList.length > 0) ?
            <StyledMovieList>
            {curMovieList.map((movie) => {
                return (
                    <MovieListItem key={movie.id} movie={movie} showAdd={add} isInCollection={existing.includes(movie.id) ? true : false} />
                )
            })}
            </StyledMovieList>
            : "No Movies Found"
        }
        </>
    )
}

export default MovieList;