import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';

import api from '../services/api';
import User from '../models/User';

interface AuthState {
  token: string;
  // barber: User;
  user: User;
}

interface SignInCredencials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredencials): Promise<AuthState>;
  signOut(): void;
  updateUser(user: User): void;
  setContextData(data: AuthState): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@$:token');
    const user = localStorage.getItem('$BARBERSHOP:user');
    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  useEffect(() => {
    const token = localStorage.getItem('$BARBERSHOP:token');
    const user = localStorage.getItem('$BARBERSHOP:user');
    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({ token, user: JSON.parse(user) });
    }
  }, []);
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post<AuthState>('/user/sign-in', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('$BARBERSHOP:token', token);
    localStorage.setItem('$BARBERSHOP:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
    return response.data;
  }, []);

  const signOut = useCallback(() => {
    const confirmed = window.confirm('Você tem certeza que deseja sair?');
    if (confirmed) {
      localStorage.removeItem('$BARBERSHOP:token');
      localStorage.removeItem('$BARBERSHOP:user');

      setData({} as AuthState);
    }
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('$BARBERSHOP:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [data.token],
  );
  const setContextData = (data: AuthState) => {
    setData(data);
  };
  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser, setContextData }}
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
