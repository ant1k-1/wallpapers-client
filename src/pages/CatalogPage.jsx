import Post from "../components/Post/Post.jsx";
import { posts } from '../data.js'
const CatalogPage = () => {
    return (
        <div>
            <h1>Каталог постов</h1>
            {posts.map(post => (
                <Post id={post.id} title={post.title} description={post.description} />
            ))}
        </div>
    )
}

export {CatalogPage}