import styled from "styled-components";

const StyledSearch = styled.form`
    display: grid;
    grid-template-columns: 300px 300px max-content;
    gap: 10px;
    position: relative;

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

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }

`;

const StyledClearSearch = styled.div`
    position: absolute;
    left: 270px;
    top: 0px;
    font-size: 2rem;
    color: #666;
    cursor: pointer;

    @media (max-width: 768px) {
        right: 8px;
        left: initial;
    }

    transform: rotate(45deg) scale(1.2);
`;

const SearchTools = (props) => {
    return (
        <StyledSearch onSubmit={props.onSearchSubmit}>
            <input type="text" id="searchBox" name="searchBox" value={props.curSearchTerm} placeholder="Search for movie" onChange={props.onSearchChange}/>
            {props.curSearchTerm && <StyledClearSearch onClick={props.onClearSearch}>+</StyledClearSearch>}
            <select onChange={props.onSortBy} value={props.curSort}>
                <option value="-vote_average">Popularity</option>
                <option value="-release_date">Release Date</option>
                <option value="title">Title</option>
                {props.page && <option value="-lastWatched">Last Watched</option>}
            </select>
            <input type="submit" value={props.page ? "Filter" : "Search"} />
        </StyledSearch>
    )
}

export default SearchTools;