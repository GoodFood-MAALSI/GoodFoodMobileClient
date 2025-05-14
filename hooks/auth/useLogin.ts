import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../Context/UserContext';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { setToken, setRefreshToken, setTokenExpires, setUser } = useUser();

  const validate = () => {
    if (!email || !password) {
      setError('Tous les champs sont requis');
      return false;
    }
    setError(null);
    return true;
  };

  const handleLogin = async () => {
    if (validate()) {
      try {
        const response = await fetch(process.env.EXPO_PUBLIC_APP_API_URL + '/client/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('refreshToken', data.refreshToken);
          await AsyncStorage.setItem('tokenExpires', String(data.tokenExpires));
          await AsyncStorage.setItem('user', JSON.stringify(data.user));

          setToken(data.token);
          setRefreshToken(data.refreshToken);
          setTokenExpires(data.tokenExpires);
          setUser(data.user);

          console.log('Login success:', data);
          return true;
        } else {
          setError(data.message || 'Connexion échouée');
          console.warn('Login failed:', data);
          return false;
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('Une erreur est survenue. Veuillez réessayer.');
        return false;
      }
    }
    return false;
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleLogin,
  };
};
