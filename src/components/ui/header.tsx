import './header.css';
import { Link } from 'react-router-dom';

interface RedirectButtonProps {
    buttonText: string;
    redirectUrl: string; 
}

export default function Header() {
    return (
        <div className='header'>
            <div className='ndwlogo'>
                <Link to='/'>
                    <img src="/ndw.svg" alt="ndwlogo" />
                </Link>
            </div>
            <div className='headerButton'>
                <RedirectButton buttonText="vind data" redirectUrl="/portal" />
            </div>
        </div>
    );
}

export function RedirectButton({ buttonText, redirectUrl }: RedirectButtonProps) {
    return (
        <div className='redirectbuttonwrap'>
            <Link to={redirectUrl}>
                <button className='redirectbutton'>{buttonText}</button>
            </Link>
        </div>
    );
}