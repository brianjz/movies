import MovieListItem from "./MovieListItem";
import styled from 'styled-components';

const StyledMovieList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const MovieList = (props) => {
    const { movies } = props

    return (
        <StyledMovieList>
        {movies.map((movie) => {
            return (
                    <MovieListItem key={movie.id} movie={movie} />
            )
        })}
        </StyledMovieList>
    )
}

export default MovieList;