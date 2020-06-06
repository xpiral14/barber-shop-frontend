import React, { FC } from 'react';
import { Content, Container } from './styles';
import Header from '../../../components/Header';
import { useAuth } from '../../../hooks/auth';
import MobileHeader from '../../../components/MobileHeader';

const CostumerLayout: React.FC = ({ children }) => {
  const links = [
    {
      to: '/costumer/dashboard',
      name: 'Inicio',
    },
    {
      to: '/costumer/appointment',
      name: 'Marcar horário',
    },
  ];
  const { user } = useAuth();
  return (
    <Container>
      <Header links={links} user={user} />
      <MobileHeader links={links} user={user}/>
      <Content>{children}</Content>
    </Container>
  );
};

export default CostumerLayout;
