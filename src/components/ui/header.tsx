import './header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

interface User {
    name: string;
    email: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (pb.authStore.isValid) {
      setUser({
        name: pb.authStore.record?.name || pb.authStore.record?.email || 'User',
        email: pb.authStore.record?.email || ''
      });
    }
  }, []);

  const handleAuth = () => {
    if (user) {
      pb.authStore.clear();
      setUser(null);
      navigate('/');
    } else {
      navigate('/portal');
    }
  };

  const showAdminPortalButton = user && location.pathname === '/';

  return (
    <div className='header'>
      <div className='ndwlogo'>
        <Link to='/'>
          <img src="/ndw.svg" alt="ndwlogo" />
        </Link>
      </div>
      {showAdminPortalButton && (
        <div className='headerButton'>
          <Link to="/portal">
            <button className='redirectbutton'>Admin portaal</button>
          </Link>
        </div>
      )}
      <div className='loginButton'>
        <button className='redirectbutton' onClick={handleAuth}>
          {user ? `Welkom ${user.name}` : 'Login'}
        </button>
      </div>
    </div>
  );
}
