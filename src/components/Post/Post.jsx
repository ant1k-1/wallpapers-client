import './Post.css'
import { Link } from "react-router-dom";

const Post = ({ id, title, description }) => {
    console.log(id);
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