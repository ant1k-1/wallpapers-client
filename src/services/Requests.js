import { useDispatch, useSelector } from "react-redux"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logoutUser, updateToken } from "../reducers/UserSlice";
import { useState } from "react";
import { setCookie, getCookie, eraseCookie } from "./Cookies";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
const APP_API_URL = import.meta.env.VITE_APP_API_URL;
const HTTPONLY_COOKIE = Number(import.meta.env.VITE_HTTPONLY_COOKIE);

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
        const response = await axios(url, {
            method: 'GET',
            ...config,
        })
        return response;
    } catch (err) {
        if (setError) { setError(err.response ? err.response.data : 'Error fetching posts') }
        return null;
    } finally {
        if (setLoading) { setLoading(false) }
    }
}
const parseError = (error) => {
    let errors = []
    if (error?.response?.data?.message?.violations) {
        error.response.data.message.violations.forEach(violation => {
            errors.push(violation.message)
        });
        return errors;
    } else if (error?.response?.data?.message){
        return [error.response.data.message];
    } else if (error){
        return [error.message +". Try later" ];
    } else {
        return ["Unknown error. Try later"];
    }
}

const postRequest = async (url, payload, config, setLoading = null, setError = null) => {
    if (setLoading) { setLoading(true); setError(false)}
    try {
        const response = await axios(url, {
            method: 'POST',
            data: payload,
            ...config,
        })
        return await response;
    } catch (error) {
        if (setError) { 
            setError(parseError(error));
        }
        return null;
    } finally {
        if (setLoading) { setLoading(false) }
    }
}

const updateAccessToken = async (dispatch) => {
    try {
        let response;
        // console.log("updateToken");
        if (HTTPONLY_COOKIE === 0) {
            let refresh = getCookie("refresh");
            response = await postRequest(`${AUTH_API_URL}/api/auth/token`, {refreshToken: refresh}, {});
            setCookie("refresh", response.data.refreshToken, 7);
        } else {
            response = await postRequest(`${AUTH_API_URL}/api/auth/token`, {}, { withCredentials: true });
        }
        const newAccessToken = response.data.accessToken;
        const newUserInfo = parseJwt(newAccessToken);
        // Обновляем состояние в Redux
        if (HTTPONLY_COOKIE === 0) dispatch(updateToken({ info: newUserInfo, jwt: newAccessToken}));
        else dispatch(updateToken({ info: newUserInfo, jwt: newAccessToken} ));
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
        return await fetchData(type, url, payload, config, setLoading, setError, APP_API_URL, true);
    }
    const fetchDataAuth = async (type, url, payload, config, setLoading = null, setError = null) => {
        const newConfig = { ...config, withCredentials: true }
        return await fetchData(type, url, payload, newConfig, setLoading, setError, AUTH_API_URL, false);
    }

    const fetchData = async (type, url, payload, config, setLoading = null, setError = null, baseUrl = null, checkAccess = null) => {
        let newConfig;
        // console.log("Token is null: " + (accessToken ? false : true));
        // console.log("Token is expired: " + isExpired(userInfo));
        // console.log("current accessToken\n" + accessToken);
        if (checkAccess && !userInfo) {
            navigate("/signin");
            return null;
        }
        if (checkAccess && isExpired(userInfo)) {
            let newAccessToken = await updateAccessToken(dispatch);
            // console.log("new accessToken\n" + accessToken);
            if (newAccessToken === null) {
                console.log('something goes wrong, try again to update token');
                newAccessToken = await updateAccessToken(dispatch);
                if (newAccessToken === null) {
                    console.log('failed to update token, then logout and login')
                    dispatch(logoutUser());
                    navigate("/signin")
                    return null;
                }
                console.log('Successfully');
            }
            newConfig = setAuthorizationHeader(config, newAccessToken);
        } else if (!checkAccess) {
            newConfig = config;
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