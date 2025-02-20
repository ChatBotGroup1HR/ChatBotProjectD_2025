import './header.css';

export default function Header(){
    return(
        <div className='header'>
            <div className='ndwlogo'>
                <a href='/'>
                <img src="/ndw.svg" alt="ndwlogo" />
                </a>
            </div>
        </div>
    );
}