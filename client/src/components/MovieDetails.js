import styled from "styled-components"
import EasyEdit, {Types} from 'react-easy-edit';
import { Link } from "react-router-dom";

const convertMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    return `${hours}h ${remainingMinutes}m`;
}

const StyledImage = styled.img`
    float: left;
    margin: 0 20px;
    border: 1px solid black;
    height: 439px;
`;

const StyledMovie = styled.div`
    background-image: ${(props) => (props.backdrop_path ? `url(https://image.tmdb.org/t/p/w780/${props.backdrop_path})` : "none")};
    background-repeat: no-repeat;
    background-position: right top;
    margin-bottom: 1000px;

    .details-box {
        background-image: linear-gradient(to right, rgb(255, 255, 255) calc(-340px + 50vw), rgba(162, 162, 162, 0.84) 60%, rgba(255, 255, 255, 0.84) 100%);
        height: 439px;
    }

    h2 {
        font-weight: 700;
        margin-bottom: 5px;
        span {
            font-weight: 400;
        }
    }

    .details {
        font-size: 1rem;

        div {
            display: inline;
            &:not(:last-child):after {
                content: '\\2022';
                padding: 0 10px;
            }
        }

        .genres span:not(:last-child):after {
            content: '|';
            padding: 0 5px;
            color: #aaa;
        }
    }

    .tagline {
        font-size: 1.2rem;
        font-style: italic;
        margin-top: 10px;
    }

    .overview {
        h5 {
            margin: 10px 0;
            font-size: 1.2em;
        }
    }

    .movie-tools {
        margin-top: 20px;
        display: flex;

        & > div {
            a {
                background-color: var(--blue);
                padding: 1px 8px 3px 8px;
                border-radius: var(--border-radius-button);
                border: 1px solid #000;
                text-decoration: none;
                color: black;
                font-weight: 600;

                &:hover {
                    background-color: var(--lower-blue);
                }
            }
            &.imdb a {
                background-color: rgb(245, 197, 24);
                &:hover {
                    background-color: var(--lower-blue);
                }
            }
            &:not(:last-child):after {
                content: '\\2022';
                padding: 0 5px;
                color: #aaa;
            }
        }

    }
    .local-details {
        display: grid;
        grid-template-columns: repeat(auto-fill, 200px);
        margin-top: 20px;

        .box-header {
            font-weight: 700;
        }
    }

    .chosen-by {
        /* cursor: pointer; */
    }
    input.edit-chosen {}
`;

const MovieDetails = ({ movie, onChangeChosenBy, onJustWatched }) => {
    const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : ''

    return (
        <>
        {movie.poster_path && <StyledImage src={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`} alt={movie.title} />}
        <StyledMovie backdrop_path={movie.backdrop_path}>
            <div className="details-box">
                <h2>{movie.title}{movieYear ? <span className="year"> ({movieYear})</span>: ''}</h2>
                <div className="details">
                    <div className="genres">
                        {movie.genres.map((g) =>
                            <span key={g.name}>{g.name}</span>
                        )}
                    </div>
                    <div className="runtime">
                        {convertMinutes(movie.runtime)}
                    </div>
                </div>
                <div className="tagline">{movie.tagline}</div>
                <div className="overview">
                    <h5>Overview</h5>
                    <span>{movie.overview}</span>
                </div>
                <div className="movie-tools">
                    { movie.imdb_id && 
                    <div className="imdb">
                        <a href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" rel="noreferrer nofollow">IMDb</a>
                    </div>
                    }
                    <div className="just-watched">
                        <Link onClick={onJustWatched} to={`/movie/${movie.id}`}>Just Watched It</Link>
                    </div>
                </div>
                <div className="local-details">
                    <div>
                        <div className="box-header">Chosen By</div>
                        <div className="box-details">
                            <EasyEdit
                                type={Types.TEXT}
                                value={movie.chosenBy || "Nobody"}
                                onSave={onChangeChosenBy}
                                saveButtonLabel="Save"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="box-header">Last Watched</div>
                        <div className="box-details">{movie.lastWatched ? new Date(movie.lastWatched).toDateString() : "Never"}</div>
                    </div>
                </div>
            </div>
        </StyledMovie>
        </>
    )
}

export default MovieDetails