import React, { createContext, useCallback, useState, useContext } from 'react';

import api from '../services/api';
import User from '../models/User';

interface AuthState {
  token: string;
  barber: User;
}

interface SignInCredencials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredencials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => { 
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const barber = localStorage.getItem('@GoBarber:barber');

    if (token && barber) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, barber: JSON.parse(barber) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post<AuthState>('/session/barber', {
      email,
      password,
    });

    const { token, barber } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(barber));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, barber });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (barber: User) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(barber));

      setData({
        token: data.token,
        barber,
      });
    },
    [data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.barber, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
