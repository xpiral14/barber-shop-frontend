import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';
import { UserType } from '../models/User';
import baseUserRoute from '../config/defaultRoutes';

interface RouteProps extends ReactDOMRouteProps {
  component: React.ComponentType;
  authTypes?: UserType[];
}

const Route: React.FC<RouteProps> = ({
  authTypes,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();
  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        if (!authTypes?.length && !user) return <Component />;
        if (!user && authTypes?.length)
          return (
            <Redirect
              to={{
                pathname: '/',
                state: { from: location },
              }}
            />
          );
          // se a rota é publica e há um usuário logado
        if (user && !authTypes?.length)
          return (
            <Redirect
              to={{
                pathname: baseUserRoute[user.userType.id],
                state: { from: location },
              }}
            />
          );
        
        return <Component />;
      }}
    />
  );
};

export default Route;
