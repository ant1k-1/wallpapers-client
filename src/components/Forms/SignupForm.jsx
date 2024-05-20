import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearError, signupUser } from "../../reducers/UserSlice";


const SignupForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.user);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        let userCreds = {
            username, password, email
        }
        dispatch(signupUser(userCreds)).then((result) => {
            if (result.payload) {
                setUsername('');
                setPassword('');
                setEmail('');
                navigate('/');
                console.log(result.payload);
            }
        })
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

            {error && (
                <div className="alert alert-danger mt-3" role="alert">{error}</div>
            )}
        </form>
    )
}

export default SignupForm;