import axios from 'axios';
import { useState } from 'react';
import styled from 'styled-components'
import missingArt from '../images/missing.png'

const StyledMovie = styled.div`
    padding: 10px;

    img {
        float: left;
        padding: 0 15px 0 0;
    }

    h4 {
        margin: 0;
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
`;

const MovieListItem = (props) => {
    const { movie, showAdd, isInCollection } = props
    const [inCollection, setInCollection] = useState(isInCollection)

    const handleAddItem = async (event) => {
        const movieId = event.target.dataset.id;
        await axios.get(`/api/movies/getMovie/${movieId}`)
        .then(async (response) => {
            let movieInfo = response.data
            movieInfo = { ...movieInfo, chosenBy: '', added: new Date() }
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
    if(showAdd) {
        movieStatus = !inCollection ? <button data-id={movie.id} onClick={handleAddItem}>Add Item</button> : "In Collection"
    } else {
        movieStatus = 'Last Watched: '
        if(movie.lastWatched.indexOf('1900') === -1) {
            movieStatus += new Date(movie.lastWatched).toLocaleDateString()
        } else {
            movieStatus += 'Never'
        }
    }

    return (
        <StyledMovie>
            {movie.poster_path ? <img src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`} alt={movie.title} />
            : <img src={missingArt} alt="Missing Cover Art" height="138" width="110" />}
            <h4>{movie.title}</h4>
            <div className="year">{movieYear}</div>
            <div className="status">{movieStatus}</div>
        </StyledMovie>
    )
}

export default MovieListItem;