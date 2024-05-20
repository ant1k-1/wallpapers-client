import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container, Row, Col, Pagination, PageItem } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { NotFoundPage } from './NotFoundPage';


const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchField, setSearchField] = useState('username');
    const [previewQuality, setPreviewQuality] = useState('');

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const { info: userInfo, jwt: accessToken } = user ? user : storedUser ? storedUser : { info: null, jwt: null };

    useEffect(() => {
        fetchPreviewQuality();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            fetchUserBySearchField();
        } else {
            fetchUsers();
        }
    }, [searchQuery, searchField, currentPage]);

    const fetchPreviewQuality = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/posts/admin/preview_quality', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken
                }
            });
            setPreviewQuality(response.data);
        } catch (error) {
            console.error('Error fetching preview quality:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            
            const response = await axios.get('http://localhost:8080/api/users/all', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken
                },
                params: {
                    page: currentPage,
                    size: 10,
                    sort: 'USER_ID_ASC'
                }
            });
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBySearchField = async () => {
        try {
            let response;
            if (searchField === 'id') {
                response = await axios.get(`http://localhost:8080/api/users/id/${searchQuery}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + accessToken
                    }
                });
            } else if (searchField === 'username') {
                response = await axios.get(`http://localhost:8080/api/users/username/${searchQuery}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + accessToken
                    }
                });
            }
            setUsers(response.data ? [response.data] : []);
            setTotalPages(1);
        } catch (error) {
            console.error('Error fetching user:', error);
            setUsers([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, status) => {
        try {
            await axios.post(`http://localhost:8080/api/users/id/${userId}/status`, { status }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken
                }
            });
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error('Error changing user status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetPreviewQuality = async () => {
        try {
            await axios.post(`http://localhost:8080/api/posts/admin/preview_quality/${previewQuality}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken
                }
            });
            alert('Preview quality set successfully');
        } catch (error) {
            console.error('Error setting preview quality:', error);
        }
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (userInfo.roles.includes("ROLE_USER") && userInfo.roles.length < 2) {
        return <NotFoundPage/>
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <h1>Admin Page</h1>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group controlId="previewQuality">
                        <Form.Label>Preview Quality % (1..100) [low quality ... big size]</Form.Label>
                        <Form.Control
                            type="number"
                            value={previewQuality}
                            min={1}
                            max={100}
                            onChange={(e) => setPreviewQuality(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={2} className="align-self-end">
                    <Button onClick={handleSetPreviewQuality}>Set Quality</Button>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form>
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="searchField">
                                    <Form.Label>Search By</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={searchField}
                                        onChange={(e) => setSearchField(e.target.value)}
                                    >
                                        <option value="username">Username</option>
                                        <option value="id">ID</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="searchQuery">
                                    <Form.Label>Search Query</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.userId}>
                                    <td>{user.userId}</td>
                                    <td><Link to={`/profile/${user.userId}`}>{user.username}</Link></td>
                                    <td>{user.email}</td>
                                    <td>{user.userStatus}</td>
                                    <td>
                                        <Button variant="success" onClick={() => handleStatusChange(user.userId, 'USER_ACTIVATED')}>Activate</Button>{' '}
                                        <Button variant="danger" onClick={() => handleStatusChange(user.userId, 'USER_BANNED')}>Ban</Button>{' '}
                                        <Button variant="warning" onClick={() => handleStatusChange(user.userId, 'USER_RESTRICTED')}>Restrict</Button>{' '}
                                        <Button variant="secondary" onClick={() => handleStatusChange(user.userId, 'USER_NOT_ACTIVATED')}>Not Activate</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="mt-3 d-flex">
                <Col>
                    <Pagination className='d-flex justify-content-center'>
                        {[...Array(totalPages).keys()].map(pageNumber => (
                            <Pagination.Item
                                key={pageNumber}
                                active={pageNumber === currentPage}
                                onClick={() => handlePageChange(pageNumber)}
                            >
                                {pageNumber + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
}

export {AdminPage}