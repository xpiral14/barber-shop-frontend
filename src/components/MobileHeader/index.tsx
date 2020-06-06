import React, { useState } from 'react';
import { HeaderContainer, HeaderContent, Profile, Menu } from './style';
import { RiMenu2Line } from 'react-icons/ri';
import User from '../../models/User';
import { Link } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';
interface HeaderProps {
  user: User;
  links?: LinkAttributes[];
}

interface LinkAttributes {
  to: string;
  name: string;
  subMenus?: LinkAttributes[];
}

const MobileHeader: React.FC<HeaderProps> = ({ user, links }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { signOut } = useAuth();
  return (
    <HeaderContainer>
      <HeaderContent>
        <RiMenu2Line onClick={() => setIsVisible(!isVisible)} />
        <Profile>
          <img src={user.perfilImageURL} alt={user.name} />
          <span>
            Bem vindo,
            <br />
            <strong>{user.name}</strong>
          </span>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </Profile>
      </HeaderContent>
      <Menu show={isVisible}>
        {links?.map((link) => (
          <div>
            <Link to={link.to} key={link.name}>
              {link.name}
            </Link>
          </div>
        ))}
      </Menu>
    </HeaderContainer>
  );
};

export default MobileHeader;
