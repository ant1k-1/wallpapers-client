import { useParams } from "react-router-dom"
import { posts } from '../data.js'
import Post from "../components/Post/Post.jsx";

export const PostPage = () => {
    const { id } = useParams(); // Получаем id из параметров URL
    const post = posts.find(post => post.id === Number(id)); // Находим пост с соответствующим id
    console.log(post);
    // Проверяем, существует ли пост с таким id
    if (!post) {
        return <div>Пост не найден</div>;
    }

    return (
        <Post id={post.id} title={post.title} description={post.description}/>
    );
}