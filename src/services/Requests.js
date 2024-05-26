import { useDispatch, useSelector } from "react-redux"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { updateToken } from "../reducers/UserSlice";
import { useState } from "react";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
const APP_API_URL = import.meta.env.VITE_APP_API_URL;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const setAuthorizationHeader = (config, token, isAuth=null) => {
    // Клонируем объект конфигурации
    const updatedConfig = {
        ...config,
        headers: {
            ...config?.headers,
            Authorization: "Bearer " + token,
        },
    };
    return updatedConfig;
};

const isExpired = (userInfo) => {
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
    // console.log("postRequest");
    if (setLoading) { setLoading(true) }
    try {
        // const response = await axios.post(url, payload, config);
        // console.log(config);
        const response = await axios(url, {
            method: 'POST',
            data: payload,
            ...config,
        })
        // console.log(response);
        return await response;
    } catch (err) {
        // console.log(err);
        if (setError) { setError(err.response ? err.response.data : 'Error fetching posts') }
        return null;
    } finally {
        if (setLoading) { setLoading(false) }
    }
}

const updateAccessToken = async (dispatch) => {
    try {
        // console.log("updateToken");
        const response = await postRequest(`${AUTH_API_URL}/api/auth/token`, {}, { withCredentials: true });
        // console.log(response);
        const newAccessToken = response.data.accessToken;
        const newUserInfo = parseJwt(newAccessToken);
        // Обновляем состояние в Redux
        dispatch(updateToken({ info: newUserInfo, jwt: newAccessToken }));
        // Обновляем localStorage
        localStorage.setItem('user', JSON.stringify({ info: newUserInfo, jwt: newAccessToken }));
        return newAccessToken;
    } catch (error) {
        console.log(error);
        return null;
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
    
    const fetchDataApi = async (type, url, payload, config, setLoading = null, setError = null) => {
        return await fetchData(type, url, payload, config, setLoading, setError, APP_API_URL);
    }
    const fetchDataAuth = async (type, url, payload, config, setLoading = null, setError = null) => {
        const newConfig = { ...config, withCredentials: true }
        return await fetchData(type, url, payload, newConfig, setLoading, setError, AUTH_API_URL);
    }

    const fetchData = async (type, url, payload, config, setLoading = null, setError = null, baseUrl = null) => {
        let newConfig;
        // console.log("Token is null: " + (accessToken ? false : true));
        // console.log("Token is expired: " + isExpired(userInfo));
        // console.log("current accessToken\n" + accessToken);
        if (!userInfo) {
            navigate("/signin");
            return null;
        }
        if (isExpired(userInfo)) {
            let newAccessToken = await updateAccessToken(dispatch);
            // console.log("new accessToken\n" + accessToken);
            if (newAccessToken === null) {
                navigate("/signin")
                return null;
            }
            newConfig = setAuthorizationHeader(config, newAccessToken);
        } else {
            newConfig = setAuthorizationHeader(config, accessToken);
        }
        switch (type) {
            case 'GET':
                return await getRequest(baseUrl + url, newConfig, setLoading, setError);
            case 'POST':
                return await postRequest(baseUrl + url, payload, newConfig, setLoading, setError);
            default:
                return null;
        }
    }
    return [fetchDataApi, fetchDataAuth];
}

export default useRequest;