import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ImageWithAuth from '../components/ImageWithAuth';

const PostPage = (props) => {
    const navigate = useNavigate();
    const { post_id } = useParams();
    const postId = props.postId === undefined ? post_id : props.postId;
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const { info: userInfo, jwt: accessToken } = user ? user : storedUser ? storedUser : { info: null, jwt: null };
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/id/${postId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + accessToken
                    },
                });
                setPost(response.data);
            } catch (err) {
                navigate("/error404");
                setError(err.response ? err.response.data : 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);


    const handleDownload = async (url, filename) => {
        const getType = (filename) => {
            const match = filename.match(/\.([^.]+)$/);
            const type = match ? match[1] : '';
            return type === 'jpg' ? 'jpeg' : 'png';
        }
        const res = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const blob = await new Blob([res.data], { type: `image/${getType(filename)}` });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }

    const handleAddToFavourites = async (post_id) => {
        const res = await axios.post(`http://localhost:8080/api/posts/id/${post_id}/like`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    const handleAccept = async () => {
        try {
            await axios.post(`http://localhost:8080/api/posts/id/${post.postId}/status`, {
                status: "POST_PUBLISHED"
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken
                }
            });
            props.setNext(true);
            //navigate('/moder'); // Redirect to moderation page or fetch the next post
        } catch (error) {
            console.error('Error accepting post:', error);
            setError('Error accepting post');
        }
    };

    const handleReject = async () => {
        try {
            await axios.post(`http://localhost:8080/api/posts/id/${post.postId}/delete`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken
                }
            });
            props.setNext(true);
            //navigate('/moder'); // Redirect to moderation page or fetch the next post
        } catch (error) {
            console.error('Error rejecting post:', error);
            setError('Error rejecting post');
        }
    };
    const chooseColor = (tagType) => {
        switch (tagType) {
            case 'TITLE': return "#1303fb";
            case 'TAG': return "#6d757d";
            case 'AUTHOR': return "#e91aff";
            default: return "6d757d";
        }
    }

    const validateSource = (source) => {
        
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <Container>
            <Row className="mb-4">
                <Col>
                    <h1>Post Details</h1>
                </Col>
            </Row>
            <Row>
                <Col md={8}>
                    <ImageWithAuth url={'http://localhost:8080/lowres/' + post.preview} token={accessToken} />
                </Col>
                <Col md={4}>
                    <h3>Details</h3>
                    <p><a href={'https://' + post.source} target="_blank" rel="noopener noreferrer">Source</a></p>
                    <p><strong>Dimensions:</strong> {post.dimensions}</p>
                    <p><strong>Size:</strong> {Math.round(post.size / 1024 / 1024 * 10) / 10} MB</p>
                    <p><strong>Status:</strong> {post.postStatus}</p>
                    <p><strong>Views:</strong> {post.views}</p>
                    <p><strong>Downloads:</strong> {post.downloads}</p>
                    <p><strong>Likes:</strong> {post.likes}</p>
                    <p><strong>Upload Date:</strong> {post.uploadDate}</p>
                    <p><Link to={"/profile/" + post.userId}>Was uploaded by</Link></p>
                    <h4>Tags</h4>
                    {post.postTags.map(tag => (
                        <span style={{ backgroundColor: chooseColor(tag.tagType).toString() }} key={tag.tagId} className="badge me-2 mb-1">
                            {tag.tagName}
                        </span>
                    ))}
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="primary" onClick={() => handleAddToFavourites(post.postId)} disabled={post.postStatus === "POST_MODERATION" ? ("disabled") : ""}>Add to favourites</Button>
                    <Button variant="info" className="ms-2" onClick={() => handleDownload('http://localhost:8080/highres/' + post.image, post.image)}>Download high-resolution</Button>
                    {(userInfo.roles.includes("ROLE_ADMIN") || userInfo.roles.includes("ROLE_MODER")) && <Button variant="danger" className="ms-2" onClick={handleReject}>Reject</Button>}
                    {(userInfo.roles.includes("ROLE_ADMIN") || userInfo.roles.includes("ROLE_MODER")) && <Button variant="success" className="ms-2" onClick={handleAccept}>Accept</Button>}
                </Col>
            </Row>
        </Container>
    );
};

export { PostPage };