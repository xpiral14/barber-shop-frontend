import React, { FC } from 'react';
import { Content, Container } from './styles';
import Header from '../../../components/Header';
import { useAuth } from '../../../hooks/auth';

const BarberLayout: React.FC = ({ children }) => {
  const { user } = useAuth();
  return (
    <Content>
      <Header user={user} />
      <Container>{children}</Container>
    </Content>
  );
};

export default BarberLayout;
