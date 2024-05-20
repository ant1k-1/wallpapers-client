import { Link } from 'react-router-dom'
import './Footer.css'

export const Footer = () => {
    return (
        <>
            <div className="font-small blue pt-4 bg-info-subtle">
                <div className="container-fluid text-center text-md-left">
                    <div className="container">
                        <p>
                            By being on the site, you agree to the <Link to={'/terms'}>terms of use</Link>.
                            If you are the copyright holder of an image published on this site and want to delete it, <a href="mailto:wallpapers@example.com">сontact us</a>.
                        </p>
                    </div>
                </div>

                <div className="text-center pb-1">
                    <p>Wallpapers © 2024</p>
                </div>
            </div>
        </>

    )
}
