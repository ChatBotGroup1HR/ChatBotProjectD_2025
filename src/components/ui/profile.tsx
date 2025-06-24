import React, { useEffect, useState } from 'react';
import './profile.css';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

interface UserData {
  id: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name?: string;
  created: string;
  updated: string;
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!pb.authStore.isValid) return;

      try {
        const userId = pb.authStore.model?.id;
        const user = await pb.collection('users').getOne(userId!);
        const mappedUser: UserData = {
          id: user.id,
          email: user.email,
          emailVisibility: user.emailVisibility,
          verified: user.verified,
          name: user.name,
          created: user.created,
          updated: user.updated,
        };
        setUserData(mappedUser);
      } catch (err) {
        console.error('Fout bij ophalen gebruiker:', err);
      }
    };

    fetchUser();
  }, []);

  if (!userData) return <p>Profielgegevens worden geladen...</p>;

  const formattedDate = new Date(userData.created).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="profile-container">
      <h2>Profiel</h2>
      <div className="profile-card">
        <div className="profile-item">
          <span className="profile-label">Naam:</span>
          <span>{userData.name || 'Geen naam opgegeven'}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">E-mail:</span>
          <span>{userData.email}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Aangemaakt op:</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;