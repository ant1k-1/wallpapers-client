import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from "react-redux";
import SignupForm from '../components/Forms/SignupForm';
import Gallary from '../components/Gallary';
import TagSearch from '../components/TagSearch';
import Loading from '../components/Loading';
import useRequest from '../services/Requests';


const HomePage = () => {
    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const { info: userInfo, jwt: accessToken } = user ? user : storedUser ? storedUser : { info: null, jwt: null };

    const [fetchDataApi, fetchDataAuth] = useRequest();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortOrder, setSortOrder] = useState('UPLOAD_DATE_DESC');
    const [search, setSearch] = useState(false);
    const [searchTags, setSearchTags] = useState([]);
    const [searchByTags, setSearchByTags] = useState(false);


    const handleSearch = () => {
        // console.log("handleSearch");
        setSearch(true);
        setSearchByTags(true);
    };
    const handleReset = () => {
        // console.log("handleReset");
        setSearchTags([]);
        setSearchByTags(false);
        setSearch(!search);
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
        params: {
            page: currentPage,
            size: 8,
            sort: sortOrder
        },
    }

    const fecthPostsByTags = async () => {
        const formattedTags = searchTags.map(tag => `${tag.tagType.toLowerCase()}:${tag.tagName}`);
        const response = await fetchDataApi('POST', '/api/posts/all/tags', { tagNames: formattedTags }, config, setLoading, setError);
        if (response) {
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
            setSearch(false);
        }
    };

    const fetchPosts = async () => {
        const response = await fetchDataApi('GET', '/api/posts/all', null, config, setLoading, setError);
        if (response) {
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
            setSearch(false);
        }
    };
    useEffect(() => {
        if (!accessToken) {
            return;
        }
        if (!searchByTags) {
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
            <TagSearch handleSearch={handleSearch} handleReset={handleReset} handleSelectedTags={setSearchTags} searchTags={searchTags} />
            <Gallary posts={posts} currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
        </Container>
    );
}
export { HomePage }