import { useDispatch, useSelector } from "react-redux"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
// const AUTH_API_URL = 'http://localhost:8081'

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const setAuthorizationHeader = (config, token) => {
    // Клонируем объект конфигурации
    const updatedConfig = {
        ...config,
        headers: {
            ...config.headers,
            Authorization: "Bearer " + token,
        },
    };
    return updatedConfig;
};

const isExpired = (userInfo) => {
    if (!userInfo || !userInfo.exp) {
        return true;
    }
    return (Date.now() >= userInfo.exp * 1000);
}

const getRequest = async (url, config, setLoading = null, setError = null) => {
    if (setLoading) { setLoading(true) }
    try {
        // const response = await axios.get(url, config);
        const response = await axios(url, {
            method: 'GET',
            ...config,
        })
        return response;
    } catch (err) {
        console.log(err);
        if (setError) { setError(err.response ? err.response.data : 'Error fetching posts') }
        return null;
    } finally {
        if (setLoading) { setLoading(false) }
    }
}

const postRequest = async (url, payload, config, setLoading = null, setError = null) => {
    console.log("postRequest");
    if (setLoading) { setLoading(true) }
    try {
        console.log(config);
        // const response = await axios.post(url, payload, config);
        const response = await axios(url, {
            method: 'POST',
            data: payload,
            ...config,
        })
        console.log(response);
        return response;
    } catch (err) {
        console.log(err);
        if (setError) { setError(err.response ? err.response.data : 'Error fetching posts') }
        return null;
    } finally {
        if (setLoading) { setLoading(false) }
    }
}

const updateToken = async (dispatch) => {
    try {
        console.log("updateToken");
        const response = await postRequest(`${AUTH_API_URL}/api/auth/token`, {}, { withCredentials: true });
        console.log(response);
        const newAccessToken = response.data.accessToken;
        const newUserInfo = parseJwt(newAccessToken);
        // Обновляем состояние в Redux
        dispatch(updateToken({ info: newUserInfo, jwt: newAccessToken }));
        // Обновляем localStorage
        localStorage.setItem('user', JSON.stringify({ info: newUserInfo, jwt: newAccessToken }));
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * 
 * @param {string} type the type of HTTP request: "GET", "POST"
 * @param {string} url the request URL
 * @param {object} config the config object for axios request
 * @param {Function} setLoading setLoading function for pending state of request
 * @param {Function} setError setError function for rejected state of request
 * @returns 
 */
const useRequest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const { info: userInfo, jwt: accessToken } = user ? user : storedUser ? storedUser : { info: null, jwt: null };

    const fetchData = async (type, url, payload, config, setLoading = null, setError = null) => {
        if (isExpired(userInfo)) {
            let success = await updateToken(dispatch);
            console.log(success);
            if (!success) {
                navigate("/signin")
                return null;
            }
        }
        let newConfig = setAuthorizationHeader(config, accessToken);
        switch (type) {
            case 'GET':
                return getRequest(url, newConfig, setLoading, setError);
            case 'POST':
                return postRequest(url, payload, newConfig, setLoading, setError);
            default:
                return null;
        }
    }
    return fetchData;
}

export default useRequest;