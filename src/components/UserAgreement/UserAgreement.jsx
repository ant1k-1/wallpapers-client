import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAgreement } from '../../actions/toggleAgreement'
import { useState } from 'react'

function UserAgreement() {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);

    const agreementAccepted = useSelector(state => state.agreement.agreementAccepted);
    const dispatch = useDispatch();

    const handleCheckboxChange = () => {
        dispatch(toggleAgreement());
    };

    return (
        <>
            <Modal
                show={show || !agreementAccepted}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>User Agreement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    By using this site you agree to the <strong>terms of use</strong>
                    <label>
                        <input
                            type="checkbox"
                            onChange={handleCheckboxChange}
                            required={true}
                        />
                        I agree to the terms and conditions
                    </label>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose} disabled={!agreementAccepted}>
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UserAgreement;