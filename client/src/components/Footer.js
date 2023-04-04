import styled from "styled-components";

const StyledFooter = styled.footer`
    font-size: 0.7em;
    margin: 10px 30px;
    padding: 10px;
    color: #999;
    text-align: right;

    a {
        color: #999;
    }
`

const Footer = () => {
    return (
        <StyledFooter>
            Movie information provided by <a href="http://tmdb.org">TMdb</a>
        </StyledFooter>
    )
}

export default Footer;