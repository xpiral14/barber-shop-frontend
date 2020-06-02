import React, { useContext } from 'react';
import {
  HeaderContent,
  Profile,
  HeaderLinkContent,
  HeaderContainer,
} from './styles';
import { FiPower } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import logoImg from '../../assets/logo.svg';
import User from '../../models/User';
import { useAuth } from '../../hooks/auth';
interface HeaderProps {
  user: User;
  links?: LinkAttributes[];
}

interface LinkAttributes {
  to: string;
  name: string;
}
const Header: React.FC<HeaderProps> = ({ user, links }) => {
  const { signOut } = useAuth();
  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={logoImg} alt="GoBarber" />

        <Profile>
          <img src={user.perfilImageURL || ''} alt={user.name} />

          <div>
            <span>Bem-vindo,</span>
            <Link to="/profile">
              <strong>{user.name}</strong>
            </Link>
          </div>
        </Profile>
        {links && (
          <HeaderLinkContent>
            {links.map(({ name, to }) => (
              <Link to={to}>{name}</Link>
            ))}
          </HeaderLinkContent>
        )}

        <button type="button" onClick={signOut}>
          <FiPower />
        </button>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
