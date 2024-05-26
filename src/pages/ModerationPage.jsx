import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { NotFoundPage } from "./NotFoundPage";
import { useSelector } from "react-redux";
import axios from "axios";
import { PostPage } from "./PostPage";
import useRequest from "../services/Requests";


const ModerPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const { info: userInfo, jwt: accessToken } = user ? user : storedUser ? storedUser : { info: null, jwt: null };

    const [next, setNext] = useState(false);
    const [fetchDataApi, fetchDataAuth] = useRequest();

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    }

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetchDataApi('GET', '/api/posts/all/status', null, {
                ...config,
                params: {
                    page: 0,
                    size: 1,
                    status: 'POST_MODERATION',
                    sort: 'UPLOAD_DATE_DESC'
                },
            }, setLoading, setError);
            if (response) { setPosts(response.data.content); }
        };
        fetchPosts();
        setNext(false);
    }, [accessToken, next]);

    if (userInfo.roles.includes("ROLE_USER") && userInfo.roles.length < 2) {
        return <NotFoundPage />
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (posts.length === 0) {
        return <div>No posts to moderate.</div>;
    }
    return (
        <div>
            <PostPage postId={posts[0].postId} setNext={setNext} />
        </div>
    );
}

export { ModerPage }