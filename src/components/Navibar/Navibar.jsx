import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../reducers/UserSlice';

export const Navibar = () => {

    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const handleLogout = () => {
        console.log("logout");
        dispatch(logoutUser());
    }
    return (
        <>
            <Navbar expand="lg" className="bg-info-subtle">
                <Container className='px-4'>
                    <Navbar.Brand as={Link} to={'/'}>Wallpapers</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to={user ? '/upload' : '/signin'}>Upload</Nav.Link>
                        
                        </Nav>
                       
                        <Nav className="me-auto">
                            {user && user.info.roles.includes("ROLE_MODER") && <Nav.Link as={Link} to={'/moder'}>Moderate</Nav.Link>}
                            {user && user.info.roles.includes("ROLE_ADMIN") && <Nav.Link as={Link} to={'/admin'}>Administrate</Nav.Link>}
                        </Nav>
                        
                        <Nav>
                            {user && (<Nav.Link as={Link} to={'/profile/'}>Profile</Nav.Link>)}
                            {!user && (<Nav.Link as={Link} to={'/signup'}>Sign up</Nav.Link>)}

                            <Nav.Link as={Link} to={user ? '/' : '/signin'} onClick={user ? handleLogout : () => { }}>
                                {user ? 'Logout' : 'Sign in'}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

