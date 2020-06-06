import React, { FC } from 'react';
import { Content, Container } from './styles';
import Header from '../../../components/Header';
import { useAuth } from '../../../hooks/auth';
import MobileHeader from '../../../components/MobileHeader';

const BarberLayout: React.FC = ({ children }) => {
  const { user } = useAuth();
  const links = [
    {
      to: '/barber/costumer/create',
      name: 'Criar cliente',
    },
  ];
  return (
    <Content>
      <Header user={user} links={links} />
      <MobileHeader user={user} links={links} />
      <Container>{children}</Container>
    </Content>
  );
};

export default BarberLayout;
