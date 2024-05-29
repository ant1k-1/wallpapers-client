import { useDispatch, useSelector } from "react-redux";
import logo from '../assets/25.gif'
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Gallary from "../components/Gallary";
import Loading from "../components/Loading";
import useRequest from "../services/Requests";

// TODO: Добавить изменение пароля
// TODO: Добавить подтверждение почты
// TODO: Поменять интерфейс

const ProfilePage = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.user);
    const { info: userInfo, jwt: accessToken } = user ? user : JSON.parse(localStorage.getItem('user'));
    const currentUserId = userId ? userId : userInfo.user_id;

    const [fetchDataApi, fetchDataAuth] = useRequest();

    const [uploads, setUploads] = useState([]);
    const [favourites, setFavourites] = useState([]);

    const [uploadsPage, setUploadsPage] = useState(0);
    const [uploadsTotalPages, setUploadsTotalPages] = useState(0);
    const [favouritesPage, setFavouritesPage] = useState(0);
    const [favouritesTotalPages, setFavouritesTotalPages] = useState(0);

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    }

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetchDataApi('GET', `/api/users/id/${currentUserId}`, null, config, setLoading, setError);
            if (response) { setProfile(response.data) }
        };
        if (currentUserId) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [currentUserId]);


    useEffect(() => {
        const fetchUploads = async () => {
            const response = await fetchDataApi('GET', `/api/users/id/${currentUserId}/uploads`, null, {
                ...config,
                params: { page: uploadsPage, size: 3, sort: 'UPLOAD_DATE_DESC' }
            }, setLoading, setError);
            if (response) {
                setUploads(response.data.content);
                setUploadsTotalPages(response.data.totalPages);
            }
        };

        if (currentUserId) {
            fetchUploads();
        } else {
            setLoading(false);
        }
    }, [currentUserId, uploadsPage]);


    useEffect(() => {
        const fetchFavourites = async () => {
            const response = await fetchDataApi('GET', `/api/users/id/${currentUserId}/favourites`, null, {
                ...config,
                params: { page: favouritesPage, size: 3, sort: 'ADDED_DATE_DESC' }
            });
            if (response) {
                setFavourites(response.data.content);
                setFavouritesTotalPages(response.data.totalPages);
            }
        };

        if (currentUserId) {
            fetchFavourites();
        } else {
            setLoading(false);
        }
    }, [currentUserId, favouritesPage]);

    const handleUploadsPageChange = (newPage) => {
        setUploadsPage(newPage);
    };

    const handleFavouritesPageChange = (newPage) => {
        setFavouritesPage(newPage);
    };

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            <h1>Profile Page</h1>
            {profile ? (
                <div>
                    <p>Username: {profile.username}</p>
                    <p>id: {profile.userId}</p>
                    <p>Email: {profile.email}</p>
                    <p>Since: {profile.registrationDate}</p>
                    <p>Status: {profile.userStatus}</p>
                    <p>Favourites: {profile.showFavourites ? 'show' : 'hidden'}</p>
                    {/* Add more profile fields as necessary */}
                </div>
            ) : (
                <div>No profile data available</div>
            )}

            <h2>Uploads</h2>
            <Gallary posts={uploads} currentPage={uploadsPage} totalPages={uploadsTotalPages} handlePageChange={handleUploadsPageChange} />

            <h2>Favourites</h2>
            <Gallary posts={favourites} currentPage={favouritesPage} totalPages={favouritesTotalPages} handlePageChange={handleFavouritesPageChange} />
        </div>
    )
}

export { ProfilePage };