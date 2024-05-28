import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setCookie, getCookie, eraseCookie } from "../services/Cookies";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
const HTTPONLY_COOKIE = Number(import.meta.env.VITE_HTTPONLY_COOKIE);

const config = {
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
}

export const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


const logout = async () => {
    let refresh = getCookie("refresh");
    await axios.post(`${AUTH_API_URL}/api/auth/logout`, { refreshToken: refresh }, config);
    if (HTTPONLY_COOKIE === 0) eraseCookie("refresh");
}


const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        error: null,
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            logout();
        },
        clearError: (state) => {
            state.error = null;
        },
        updateToken: (state, action) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    info: action.payload.info,
                    jwt: action.payload.jwt,
                };
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
        signupUser: (state, action) => {
            let userData = {
                info: parseJwt(action.payload.accessToken),
                jwt: action.payload.accessToken
            };
            localStorage.setItem('user', JSON.stringify(userData));
            state.user = userData;
            if (HTTPONLY_COOKIE === 0) { setCookie("refresh", action.payload.refreshToken, 7) }
        },
        signinUser: (state, action) => {
            let userData = {
                info: parseJwt(action.payload.accessToken),
                jwt: action.payload.accessToken,
            };
            localStorage.setItem('user', JSON.stringify(userData));
            state.user = userData;
            if (HTTPONLY_COOKIE === 0) { setCookie("refresh", action.payload.refreshToken, 7) }
        }

    },
})
export const { logoutUser, clearError, updateToken, signupUser, signinUser } = userSlice.actions;
export default userSlice.reducer;