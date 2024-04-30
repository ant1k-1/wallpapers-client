import { Link, Outlet } from "react-router-dom";
import { Button } from '../Button/Button'

const Layout = () => {
    return (
        <>
            <header>
                <Button to={'/'} description={'Home'}/>
                <Button to={'/catalog'} description={'Catalog'}/>
                <Button to={'/signin'} description={'Sign in'}/>
                {/* <Link to={'/'}>Home</Link>
                <Link to={'/catalog'}>Catalog</Link>
                <Link to={'/signin'}>Sign in</Link> */}
            </header>
            <main>
                <Outlet />
            </main>

            <footer>
                Wallpapers 2024
            </footer>
        </>
    )
}

export {Layout}