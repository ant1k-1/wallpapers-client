import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginUser } from "../../reducers/UserSlice";
import { useNavigate } from "react-router-dom";

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

    const [user, setUser] = useState(getUser());

    const { loading, error } = useSelector((state) => state.user)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleLoginEvent = (e) => {
        e.preventDefault();
        let userCreds = {
            username, password
        }
        dispatch(loginUser(userCreds)).then((result) => {
            if (result.payload) {
                setUsername('');
                setPassword('');
                setUser(user);
                navigate('/');
            }
        })
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
            {error && (
                <div className="alert alert-danger mt-3" role="alert">{error}</div>
            )}
        </form>
    )
}

export default SigninForm;