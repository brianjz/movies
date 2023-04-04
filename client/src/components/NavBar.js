import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Modal } from './Modal';

const StyledNavBar = styled.div`
    ${({ theme }) => theme.mixins.flexBetween};
    position: fixed;
    top: 0;
    width: 100%;
    height: 50px;
    background-color: var(--blue);
    z-index: 100;
`;

const StyledNav = styled.ul`
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    overflow: hidden;

    li {
        list-style-type: none;
        padding: 5px 10px;

        &:not(:last-child):after {
            content: "|";
            margin-left: 15px;
            color: var(--slate)
        }

        div { display: inline; }
    }

    @media (max-width: 1080px) {
        display: ${props => (props.dropMenuOpen ? 'inline' : 'none ')};
        padding: 20px 10px;
        background-color: var(--blue);
        height: 100vh;
        width: 30vw;
        margin-top: 50px;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 26;
        box-shadow: 15px 10px 30px -15px var(--navy-shadow);
        transform: translateX(${props => (props.dropMenuOpen ? 0 : 100)}vw);
        visibility: ${props => (props.dropMenuOpen ? 'visible' : 'hidden')};
        transition: var(--transition);

        li {
            &:before {
                content: "\u00BB";
                margin-right: 5px;
            }
            &:not(:last-child):after {
                content: "";
            }
        }
    }
    @media (max-width: 768px) {
        width: 75vw;
    }
`;

const StyledBurger = styled.div`
    display: none;
    z-index: 6;
    width: 2rem;
    height: 2rem;
    justify-content: space-around;
    flex-flow: column nowrap;
    z-index: 10;
    cursor: pointer;

    @media (max-width: 1080px) {
        display:flex;
        margin-left: 10px;
        z-index: 7;
    }

    .burger {
        width: 2rem;
        height: 0.25rem;
        border-radius: 10px;
        background-color: var(--dark-blue);
        transform-origin: 1px;
        transition: all 0.3s linear;
        &.burger1{
            transform: ${props => (props.dropMenuOpen ? 'translate(3px, -2px) scaleX(0.8)' : 'translate(0) scaleX(1)')};
        }
        &.burger2{
            transform: ${props => (props.dropMenuOpen ? 'translate(4px, 8px) scale(0.8)' : 'translate(0) scale(1)')};
        }
        &.burger3{
            transform: ${props => (props.dropMenuOpen ? 'translateX(6px) translateY(-4px) rotate(-43deg)' : 'translateX(0) translateY(0) rotate(0)')};
        }
    }
`;

const StyledSiteName = styled.div`
    margin-left: 20px;
    font-weight: 600;
    font-size: 1.3em;
    display: flex;
    
    & :not(:last-child):after {
        content: "|";
        margin: 0 8px;
        color: var(--slate)
    }


    @media (max-width: 1080px) {
        margin-right: 1rem;
        font-size: 1.2rem;
    }
    @media (max-width:768px) {
        margin-right: 1rem;
    }
`;

const StyledWhoButton = styled.button`
    border: 0;
    background-color: transparent;
    font-size: 1.3rem;
    font-weight: 500;
    cursor: pointer;
`;

const NavBar = () => {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
	const [shouldShowModal, setShouldShowModal] = useState(false);
	const [whoAmI, setWhoAmI] = useState(localStorage.getItem('moviesuser'));

    const toggleHamburger = () => {
        setHamburgerOpen(!hamburgerOpen)
    }

    const handleUserSet = (e) => {
        localStorage.setItem('moviesuser', whoAmI);
        setShouldShowModal(false)
    }

    const handleUserChange = (e) => {
        setWhoAmI(e.target.value)
    }

    return (
        <StyledNavBar id="navBar">
            <StyledBurger dropMenuOpen={hamburgerOpen ? true : false } onClick={toggleHamburger}>
                <div className="burger burger1"></div>
                <div className="burger burger2"></div>
                <div className="burger burger3"></div>
            </StyledBurger>
            <StyledSiteName dropMenuOpen={hamburgerOpen ? true : false }>
                <div><Link className="inline-link" to="/">Movies</Link></div>
                <StyledWhoButton onClick={() => setShouldShowModal(!shouldShowModal) }>
                    {whoAmI || "Who Are You?"}
                </StyledWhoButton>
            </StyledSiteName>
            <StyledNav dropMenuOpen={hamburgerOpen ? true : false } onClick={toggleHamburger}>
                <li><Link className="inline-link" to="/">Movie List</Link></li>
                <li><Link className="inline-link" to="/movie/add">Add Movie</Link></li>
            </StyledNav>
            <Modal shouldShow={shouldShowModal}	onRequestClose={() => setShouldShowModal(false)}>
			    <input type="text" placeholder="Your name" value={whoAmI || ''} onChange={handleUserChange} />
                <button onClick={handleUserSet}>Set</button>
            </Modal>
        </StyledNavBar>
    );
}

export default NavBar;