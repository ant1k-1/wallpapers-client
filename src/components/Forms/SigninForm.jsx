import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { signinUser } from "../../reducers/UserSlice";
import { useNavigate } from "react-router-dom";
import useRequest from "../../services/Requests";
import ErrorAlert from "../ErrorAlert";

function getUser() {
    let user = localStorage.getItem('user');
    if (user) {
        user = JSON.parse(user);
    } else {
        user = null;
    }
    return user;
}


const SigninForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetchDataApi, fetchDataAuth] = useRequest();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLoginEvent = async (e) => {
        e.preventDefault();
        let userCreds = {
            username, password
        }
        const response = await fetchDataAuth('POST', '/api/auth/login', userCreds, { headers: { "Content-Type": "application/json" } }, setLoading, setError);
        if (response) {
            dispatch(signinUser(response.data));
            setUsername('');
            setPassword('');
            navigate('/');
        }
    }
    return (
        <form className="form-group mx-auto" style={{ width: '20rem' }} onSubmit={handleLoginEvent}>
            <label>Username</label>
            <input type="text" required className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label>Password</label>
            <input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button type="submit" className="btn btn-success btn-md mt-3" style={{ width: '6rem' }}>
                {loading ? 'Loading...' : 'Login'}
            </button>
            <ErrorAlert error={error} />
        </form>
    )
}

export default SigninForm;