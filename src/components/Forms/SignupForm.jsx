import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../reducers/UserSlice";
import useRequest from "../../services/Requests";
import ErrorAlert from "../ErrorAlert";

const SignupForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [fetchDataApi, fetchDataAuth] = useRequest();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        let userCreds = {
            username, password, email
        }
        const response = await fetchDataAuth('POST', '/api/auth/signup', userCreds, { headers: { "Content-Type": "application/json" } }, setLoading, setError);
        if (response) {
            dispatch(signupUser(response.data));
            setUsername('');
            setPassword('');
            setEmail('');
            navigate('/');
        }
    }
    return (
        <form className="form-group mx-auto" style={{ width: '20rem' }} onSubmit={handleOnSubmit}>
            <label>Username <span style={{ color: 'red' }}>*</span></label>
            <input type="text" required className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label>Password <span style={{ color: 'red' }}>*</span></label>
            <input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />

            <label>Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelper" />
            <div id="emailHelper" className="form-text">Optional. Used if You forgot password</div>

            <div className="d-flex flex-column align-items-center mt-3">
                <button type="submit" className="btn btn-success btn-md" style={{ width: '6rem' }}>
                    {loading ? 'Loading...' : 'Sign up'}
                </button>
                <Link to="/signin" className="mt-2">Already have an account?</Link>
            </div>
            <ErrorAlert error={error} />
        </form>
    )
}

export default SignupForm;