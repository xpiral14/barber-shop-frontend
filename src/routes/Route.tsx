import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';
import { UserType } from '../models/User';
import baseUserRoute from '../config/defaultRoutes';
import CostumerLayout from '../pages/_Layout/CostumerLayout';
import BarberLayout from '../pages/_Layout/BarberLayout';
import PublicLayout from '../pages/_Layout/PublicLayout';

interface RouteProps extends ReactDOMRouteProps {
  component: React.ComponentType;
  authTypes?: UserType[];
}
const layouts = {
  Costumer: CostumerLayout,
  Barber: BarberLayout,
  Public: PublicLayout,
};
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
        if (!authTypes?.length && !user)
          return (
            <layouts.Public>
              <Component />
            </layouts.Public>
          );

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
        let PrivateLayout = layouts.Barber;
        switch (user.userType.id) {
          case 1:
            PrivateLayout = layouts.Barber;
            break;
          case 2:
            PrivateLayout = layouts.Costumer;
            break;
        }

        return (
          <PrivateLayout>
            <Component />
          </PrivateLayout>
        );
      }}
    />
  );
};

export default Route;
