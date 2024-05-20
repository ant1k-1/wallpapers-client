import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import ImageWithAuth from '../components/ImageWithAuth';
import SignupForm from '../components/Forms/SignupForm';
import Gallary from '../components/Gallary';
import { parseJwt, updateToken } from '../reducers/UserSlice';
import TagSearch from '../components/TagSearch';
import Loading from '../components/Loading';

const HomePage = () => {
    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const { info: userInfo, jwt: accessToken } = user ? user : storedUser ? storedUser : { info: null, jwt: null };

    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortOrder, setSortOrder] = useState('UPLOAD_DATE_DESC');
    const [search, setSearch] = useState(false);
    const [searchTags, setSearchTags] = useState([]);


    const handleSearch = () => {
        // console.log("handleSearch");
        setSearch(true);
    };
    const handleReset = () => {
        // console.log("handleReset");
        setSearchTags([]);
        setSearch(false);
    }
    const fecthPostsByTags = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8080/api/posts/all/tags`, {tagNames: searchTags},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + accessToken
                    },
                    withCredentials: true,
                    params: {
                        page: currentPage,
                        size: 8,
                        sort: sortOrder
                    },
                });
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                try {
                    // Обновление accessToken
                    const refreshResponse = await axios.post(`http://localhost:8081/api/auth/token`, {}, {
                        withCredentials: true
                    });
                    const newAccessToken = refreshResponse.data.accessToken;
                    dispatch(updateToken({ info: parseJwt(newAccessToken), jwt: newAccessToken }));
                
                    // Повторный запрос с новым токеном
                    const retryResponse = await axios.post(`http://localhost:8080/api/posts/all/tags`, {tagNames: searchTags}, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + newAccessToken
                        },
                        withCredentials: true,
                        params: { 
                            page: currentPage,
                            size: 8,
                            sort: sortOrder
                        },
                    });

                    setPosts(retryResponse.data.content);
                    setTotalPages(retryResponse.data.totalPages);
                } catch (refreshError) {
                    setError(refreshError.response ? refreshError.response.data : 'Error refreshing token');
                }
            } else {
                console.log(err);
                setError(err.response ? err.response.data : 'Error fetching posts');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/all`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + accessToken
                    },
                    withCredentials: true,
                    params: {
                        page: currentPage,
                        size: 8,
                        sort: sortOrder
                    },
                });
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                try {
                    // Обновление accessToken
                    const refreshResponse = await axios.post(`http://localhost:8081/api/auth/token`, {}, {
                        withCredentials: true
                    });
                    const newAccessToken = refreshResponse.data.accessToken;
                    dispatch(updateToken({ info: parseJwt(newAccessToken), jwt: newAccessToken }));
                    // Повторный запрос с новым токеном
                    const retryResponse = await axios.get(`http://localhost:8080/api/posts/all`, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + newAccessToken
                        },
                        withCredentials: true,
                        params: {
                            page: currentPage,
                            size: 8,
                            sort: sortOrder
                        },
                    });

                    setPosts(retryResponse.data.content);
                    setTotalPages(retryResponse.data.totalPages);
                } catch (refreshError) {
                    setError(refreshError.response ? refreshError.response.data : 'Error refreshing token');
                }
            } else {
                setError(err.response ? err.response.data : 'Error fetching posts');
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!accessToken) {
            return;
        }
        if (!search) {
            fetchPosts();
        } else {
            fecthPostsByTags();
        }
    }, [search, currentPage, sortOrder]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSortChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
        setCurrentPage(0); // Reset to first page on sort change
    };

    if (!userInfo && !accessToken) {
        return (
            <>
                <div className='mx-auto' style={{ width: "50vw" }}>
                    <h4>To view this site You need to be registered here. </h4>
                    <h4>It's free and no email or tel required!</h4>
                    <h4>Only username and password</h4>
                </div>
                <SignupForm />
            </>
        );
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-3 mx-3">
                <h1>Images</h1>
                <div>
                    <Button
                        variant="outline-primary"
                        onClick={() => handleSortChange('UPLOAD_DATE_DESC')}
                        active={sortOrder === 'UPLOAD_DATE_DESC'}
                        className='me-2'
                    >
                        Sort by Upload Date
                    </Button>
                    <Button
                        variant="outline-primary"
                        onClick={() => handleSortChange('VIEWS_DESC')}
                        active={sortOrder === 'VIEWS_DESC'}
                    >
                        Sort by Views
                    </Button>
                </div>
            </div>
            <TagSearch handleSearch={handleSearch} handleReset={handleReset} handleSelectTags={setSearchTags} accessToken={accessToken} />
            <Gallary posts={posts} currentPage={currentPage} totalPages={totalPages} accessToken={accessToken} handlePageChange={handlePageChange} />
        </Container>
    );
}
// {
//     "postId": 34,
//     "userId": 1,
//     "source": "yandex.ru",
//     "dimensions": "10000x5012",
//     "size": 12839244,
//     "postStatus": "POST_MODERATION",
//     "postTags": [
//         {
//             "tagId": 10,
//             "tagType": "AUTHOR",
//             "tagName": "aboba",
//             "usageCount": 6
//         },
//         {
//             "tagId": 12,
//             "tagType": "TITLE",
//             "tagName": "someanime",
//             "usageCount": 5
//         },
//         {
//             "tagId": 8,
//             "tagType": "TAG",
//             "tagName": "test1",
//             "usageCount": 7
//         },
//         {
//             "tagId": 9,
//             "tagType": "TAG",
//             "tagName": "test3",
//             "usageCount": 6
//         }
//     ],
//     "views": 0,
//     "downloads": 0,
//     "likes": 0,
//     "image": "4033b7bd-d898-4572-acb6-bae0ae8f8f60.jpg",
//     "preview": "4033b7bd-d898-4572-acb6-bae0ae8f8f60.webp",
//     "uploadDate": "18 May 2024 01:44:43"
// }
export { HomePage }