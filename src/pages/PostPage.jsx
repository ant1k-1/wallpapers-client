import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ImageWithAuth from '../components/ImageWithAuth';
import useRequest from '../services/Requests';

const PostPage = (props) => {
    const navigate = useNavigate();
    const { post_id } = useParams();
    const postId = props.postId === undefined ? post_id : props.postId;
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [fetchDataApi, fetchDataAuth] = useRequest();

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    }

    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const { info: userInfo, jwt: accessToken } = user ? user : storedUser ? storedUser : { info: null, jwt: null };
    useEffect(() => {
        const fetchPost = async () => {
            const response = await fetchDataApi('GET', `/api/posts/id/${postId}`, null, config, setLoading, setError);
            if (response) { setPost(response.data); }
            else { navigate("/error404"); }
        };
        fetchPost();
    }, [postId]);


    const handleDownload = async (url, filename) => {
        const getType = (filename) => {
            const match = filename.match(/\.([^.]+)$/);
            const type = match ? match[1] : '';
            return type === 'jpg' ? 'jpeg' : 'png';
        }
        const res = await fetchDataApi('GET', url, null, { responseType: 'arraybuffer' });
        const blob = await new Blob([res.data], { type: `image/${getType(filename)}` });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }

    const handleAddToFavourites = async (post_id) => {
        await fetchDataApi('POST', `/api/posts/id/${post_id}/like`, {}, {});
    }

    const handleAccept = async () => {
        try {
            await fetchDataApi('POST', `/api/posts/id/${post.postId}/status`, { status: "POST_PUBLISHED" }, config);
            props.setNext(true);
        } catch (error) {
            console.error('Error accepting post:', error);
            setError('Error accepting post');
        }
    };

    const handleReject = async () => {
        try {
            await fetchDataApi('POST', `/api/posts/id/${post.postId}/delete`, {}, config);
            props?.setNext(true);
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
        if(source.startsWith("https://")) return source;
        else if (source.startsWith("http://")) return source.replace("http://", "https://");
        else return "https://" + source;
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
                    <ImageWithAuth url={'/lowres/' + post.preview} token={accessToken} />
                </Col>
                <Col md={4}>
                    <h3>Details</h3>
                    <p><a href={validateSource(post.source)} target="_blank" rel="noopener noreferrer">Source</a></p>
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
                    <Button variant="info" className="ms-2" onClick={() => handleDownload('/highres/' + post.image, post.image)}>Download high-resolution</Button>
                    {(userInfo.roles.includes("ROLE_ADMIN") || userInfo.roles.includes("ROLE_MODER")) && <Button variant="danger" className="ms-2" onClick={handleReject}>Delete</Button>}
                    {(userInfo.roles.includes("ROLE_ADMIN") || userInfo.roles.includes("ROLE_MODER")) && <Button variant="success" className="ms-2" onClick={handleAccept}>Accept</Button>}
                </Col>
            </Row>
        </Container>
    );
};

export { PostPage };