import styled from 'styled-components'

const StyledMovie = styled.div`
    padding: 10px;

    img {
        float: left;
        padding: 0 15px 0 0;
    }

    h4 {
        margin: 0;
    }
`;

const MovieListItem = (props) => {
    const { movie } = props
    const movieYear = new Date(movie.release_date).getFullYear()

    return (
        <StyledMovie>
            <img src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`} alt={movie.title} />
            <h4>{movie.title}</h4>
            <div className="year">{movieYear}</div>
        </StyledMovie>
    )
}

export default MovieListItem;