import './Button.css'
import { Link } from "react-router-dom";

const Button = ({to, description}) => {
    return (
        <button className='button'>
            <Link to={to}>{description}</Link>
        </button>
    )
}

export {Button}