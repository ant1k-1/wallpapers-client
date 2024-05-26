import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

const config = {
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
}

export const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async(userCreds) => {
        const req = await axios.post(`${AUTH_API_URL}/api/auth/login`, JSON.stringify(userCreds), config);
        const res = await req.data;
        return res;
    }
);

export const signupUser = createAsyncThunk(
    'user/signupUser',
    async(userCreds) => {
        const req = await axios.post(`${AUTH_API_URL}/api/auth/signup`, JSON.stringify(userCreds), config);
        const res = await req.data;
        return res;
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        error: null
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            axios.post(`${AUTH_API_URL}/api/auth/logout`, {}, config);
        },
        clearError: (state) => {
            state.error = null;
        },
        updateToken: (state, action) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    info: action.payload.info,
                    jwt: action.payload.jwt
                };
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.user = null;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                let userData = {
                    info: parseJwt(action.payload.accessToken), 
                    jwt: action.payload.accessToken
                };
                localStorage.setItem('user', JSON.stringify(userData));
                state.user = userData;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                if (action.error.message === 'Request failed with status code 401') {
                    state.error = 'Invalid Credentials';
                }
                else {
                    state.error = action.error.message;
                }
            })
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                let userData = {
                    info: parseJwt(action.payload.accessToken), 
                    jwt: action.payload.accessToken
                };
                localStorage.setItem('user', JSON.stringify(userData));
                state.user = userData;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                if (action.error.code === "ERR_BAD_REQUEST") {
                    state.error = 'Username' + ' "' + action.meta.arg['username'] + '" ' + 'already exists';
                }
                else {
                    state.error = action.error.message;
                }
                state.user = null
            })
    }
})
export const { logoutUser, clearError, updateToken } = userSlice.actions;
export default userSlice.reducer;