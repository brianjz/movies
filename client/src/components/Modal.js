import styled from 'styled-components';

const ModalBackground = styled.div`
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: rgba(0, 0, 0, 0.8);
`;

const ModalBody = styled.div`
	background-color: white;
	margin: 10% auto;
	padding: 30px;
	width: 70%;
    position: relative;

	@media (max-width:768px) {
		width: 90%;
		margin-top: 70px;
	}
`;

const StyledClearSearch = styled.div`
    position: absolute;
    font-size: 2rem;
    color: #666;
    cursor: pointer;
    width: 30px;
    top: 0px;
    left: 10px;

    transform: rotate(45deg) scale(1.2);
`;


export const Modal = ({ shouldShow, onRequestClose, children }) => {
	return shouldShow ? (
		<ModalBackground onClick={onRequestClose}>
			<ModalBody onClick={e => e.stopPropagation()}>
                <StyledClearSearch onClick={onRequestClose}>+</StyledClearSearch>
				{children}
			</ModalBody>
		</ModalBackground>
	) : null;
}