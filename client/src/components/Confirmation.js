import { Modal } from "./Modal";
import { confirmable, createConfirmation } from 'react-confirm'
import styled from "styled-components";

const StyledConfirmation = styled.div`
    button {
        font-size: 1rem;
        padding: 5px;
        margin: 0 5px;
    }
`

const Confirmation = ({show, proceed, confirmation, options}) => {
    const ConfirmBox = (
        <StyledConfirmation>
            <h4>Are you sure?</h4>
            <button
                className="button"
                onClick={() => proceed(true)}
            >Ok</button>
            <button className="button" onClick={() => proceed(false)}>Cancel</button>
        </StyledConfirmation>
    )

    return (
        <Modal shouldShow={show} onRequestClose={() => proceed(false)} children={ConfirmBox} />
    )
}

export function confirm(
    confirmation,
    options = {}
) {
    return createConfirmation(confirmable(Confirmation))({
        confirmation,
        ...options
    });
}