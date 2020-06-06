import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

import Dashboard from '../pages/Barber/Dashboard';
import Profile from '../pages/Barber/Profile';
import { UserType } from '../models/User';
import DashBoardCostumer from '../pages/Costumer/Dashboard';
import MakeAppointment from '../pages/Costumer/MakeAppointment';
import CreateCostumer from '../pages/Barber/CreateCostumer';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route
      path="/barber/dashboard"
      component={Dashboard}
      authTypes={[UserType.BARBER]}
    />
    <Route
      path="/barber/costumer/create"
      component={CreateCostumer}
      authTypes={[UserType.BARBER]}
    />
    <Route path="/profile" component={Profile} authTypes={[UserType.BARBER]} />

    <Route
      path="/costumer/dashboard"
      component={DashBoardCostumer}
      authTypes={[UserType.COSTUMER]}
    />
    <Route
      path="/costumer/appointment"
      component={MakeAppointment}
      authTypes={[UserType.COSTUMER]}
    />

    <Route
      path="/"
      component={() => <h1>Não Encotrou</h1>}
      authTypes={[UserType.BARBER, UserType.COSTUMER]}
    />
  </Switch>
);

export default Routes;
