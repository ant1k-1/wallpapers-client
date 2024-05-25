import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import ImageWithAuth from '../components/ImageWithAuth';


const WALLPAPERS_API_URL = import.meta.env.VITE_APP_API_URL;

const Gallary = (props) => {
    const {posts, currentPage, totalPages, handlePageChange} = props;
    return (
        <>
            <Container>
                <Row>
                    {posts.map(post => (
                        <Col key={post.postId} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Link to={`/post/${post.postId}`}>
                                <ImageWithAuth url={`${WALLPAPERS_API_URL}/lowres/` + post.preview} />
                            </Link>
                        </Col>
                    ))}
                </Row>
                <div className="d-flex justify-content-center mt-3">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index}
                            variant="outline-secondary"
                            onClick={() => handlePageChange(index)}
                            active={index === currentPage}
                            className='m-1'
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>
            </Container>
        </>
    )
}

export default Gallary;