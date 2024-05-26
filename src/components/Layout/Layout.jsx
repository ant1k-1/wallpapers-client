import { Link, Outlet } from "react-router-dom";
import { Footer } from "../Footer/Footer";
import { Navibar } from "../Navibar/Navibar";
import { Container } from "react-bootstrap";
import UserAgreement from "../UserAgreement/UserAgreement";
import { useSelector, useDispatch } from 'react-redux';

const Layout = () => {
    return (
        <>
            <header>
                <Navibar/>
            </header>
            <main>
                {/* <UserAgreement /> */}
                <Container>
                    <Outlet />
                </Container>
            </main>

            <footer>
                <Footer/>
            </footer>
        </>
    )
}

export {Layout}