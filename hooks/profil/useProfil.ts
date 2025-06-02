import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useRefreshToken from '../useRefreshToken';
import { useUser } from '../../Context/UserContext';

const useUserProfil = () => {
    const { refreshAccessToken } = useRefreshToken();
    const { user, tokenExpires, setUser } = useUser();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isTokenExpired = () => {
        if (!tokenExpires) return true;
        return Date.now() >= tokenExpires;
    };

    const updateProfil = async (profilData: any) => {
        setIsLoading(true);
        setError(null);
        try {
            if (isTokenExpired()) {
                const refreshSuccess = await refreshAccessToken();
                if (!refreshSuccess) {
                    setError('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
                    return false;
                }
            }
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                setError('Vous devez être connecté');
                return false;
            }
            const id = user.id;
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_CLIENT_API}/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profilData),
            });

            const { data } = await response.json();

            if (response.ok) {
                const updatedUser = { ...user, ...data };
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                console.log('Nom et prénom mis à jour avec succès');
                return true;
            } else if (response.status === 401) {
                console.log('Token expiré, tentative de rafraîchissement');
                const refreshSuccess = await refreshAccessToken();
                if (refreshSuccess) {
                    console.log('Token rafraîchi avec succès');
                    return await updateProfil(profilData);
                } else {
                    setError('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
                    console.log('Échec du rafraîchissement du token');
                    return false;
                }
            } else {
                setError('Erreur lors de la mise à jour du nom et prénom');
                console.error('Erreur mise à jour adresse:', data);
                return false;
            }
        } catch (err) {
            setError('Erreur de réseau lors de la mise à jour du nom et prénom');
            console.error('Erreur réseau mise à jour nom et prénom:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    };
    return {
        isLoading,
        error,
        updateProfil,
    };
};

export default useUserProfil;