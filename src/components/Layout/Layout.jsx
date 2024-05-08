import { Link, Outlet } from "react-router-dom";
import { Button } from '../Button/Button';
import { Footer } from "../Footer/Footer";
import { Navibar } from "../Navibar/Navibar";
import { Container } from "react-bootstrap";
import UserAgreement from "../UserAgreement/UserAgreement";

const Layout = () => {
    return (
        <>
            <header>
                <Navibar/>
            </header>
            <main>
                <UserAgreement />
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