import axios from 'axios';
import { useState } from 'react';
import styled from 'styled-components'
import missingArt from '../images/missing.png'
import { Link } from 'react-router-dom'

const StyledMovie = styled.div`
    position: relative;
    padding: 10px;
    border: ${(props) => (props.isSelected ? "1px solid red" : "none")};

    img {
        float: left;
        padding: 0 15px 0 0;
    }

    h4 {
        margin: 0;
        @media (max-width: 768px) {
            padding-left: 107px;
        }
    }

    .status {
        font-size: 0.7em;
        color: #777;
    }

    .status button {
        background-color: var(--lower-blue);
        border: 1px solid black;
        padding: 10px;
        color: var(--white);
        font-size: 1em;
        border-radius: var(--border-radius-button);
        cursor: pointer;
        &:hover {
            color: black;
            background-color: var(--blue);
        }
    }

    .remove {
        font-size: 0.7em;
        position: absolute;
        right: 10px;
        bottom: 10px;
        opacity: 0.7;
        
        button {
            border: 0;
            color: red;
            background-color: transparent;
            cursor: pointer;
        }
    }
`;

const MovieListItem = (props) => {
    const { movie, showAdd, isInCollection } = props
    const [inCollection, setInCollection] = useState(isInCollection)

    const handleAddItem = async (event) => {
        const movieId = event.target.dataset.id;
        const whoAmI = localStorage.getItem('moviesuser');
        await axios.get(`/api/movies/getMovie/${movieId}`)
        .then(async (response) => {
            let movieInfo = response.data
            movieInfo = { ...movieInfo, chosenBy: whoAmI || '', added: new Date() }
            console.log(movieInfo)
            const result = await axios.put('/api/movies/addMovie', movieInfo)
            return result.data;
        })
        .then((result) => {
            if(result.updated) {
                setInCollection(true)
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : ''

    let movieStatus = ''
    let movieChosen = ''
    if(showAdd) {
        movieStatus = !inCollection ? <button data-id={movie.id} onClick={handleAddItem}>Add Item</button> : "In Collection"
    } else {
        movieStatus = 'Last Watched: '
        if(movie.lastWatched.indexOf('1900') === -1) {
            movieStatus += new Date(movie.lastWatched).toLocaleDateString()
        } else {
            movieStatus += 'Never'
        }
        movieChosen = 'Chosen By: ' + (movie.chosenBy || 'Nobody')
    }

    return (
        <StyledMovie>
            {movie.poster_path ? <Link to={`/movie/${movie.id}`}><img src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`} alt={movie.title} /></Link>
            : <img src={missingArt} alt="Missing Cover Art" height="138" width="110" />}
            <h4><Link to={`/movie/${movie.id}`} onClick={(e) => props.onMovieClick(e, movie.id)} className="inline-link">{movie.title}</Link></h4>
            <div className="year">{movieYear}</div>
            <div className="status">{movieStatus}{movieChosen ? <span><br />{movieChosen}</span> : ''}</div>
            <div className="remove"><button onClick={(e) => props.onDelete(e, movie.id)}>Remove</button></div>
        </StyledMovie>
    )
}

export default MovieListItem;