import './header.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface RedirectButtonProps {
  buttonText: string;
  redirectUrl: string;
}

interface LoginButtonProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface User {
    name: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <div className='header'>
      <div className='ndwlogo'>
        <Link to='/'>
          <img src="/ndw.svg" alt="ndwlogo" />
        </Link>
      </div>
      <div className='headerButton'>
        <RedirectButton buttonText="Admin portaal" redirectUrl="/portal" />
      </div>
      <div className='loginButton'>
        <LoginButton user={user} setUser={setUser} />
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

export function LoginButton({ user, setUser }: LoginButtonProps) {
  const handleLogin = () => {
    if (user) {
      setUser(null); // Log out the user
    } else {
      setUser({ name: 'TestUser' }); // Log in a temporary test user
    }
  };

  return (
    <div className='redirectbuttonwrap'>
      <button className='redirectbutton' onClick={handleLogin}>
        {user ? `Welcome (${user.name})!` : 'Login'}
      </button>
    </div>
  );
}
