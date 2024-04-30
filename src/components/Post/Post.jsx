import './Post.css'
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Post = ({ id, title, description }) => {
    return (
        <div className="post">
            <Link to={`/post/${id}`}>
                <h2>{title}</h2>
            </Link>
            <div className="post-divider"></div>
            <h5>id={id}</h5>
            <div className="post-divider"></div>
            <p>{description}</p>
        </div>
    );
};

export default Post;