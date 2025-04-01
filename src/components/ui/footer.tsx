import './footer.css' ;
import './header.css' ;
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className='footer'>
            <div className='ndwlogo'>
                <Link to='/'>
                    <img src="/ndw.svg" alt="ndwlogo" />
                </Link>
            </div>
        </div>
    );
}
