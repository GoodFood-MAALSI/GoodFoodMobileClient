import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useRefreshToken from '../UseRefreshToken';
import { useUser } from '../../Context/UserContext';

const useCategories = () => {
    const { refreshAccessToken } = useRefreshToken();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { tokenExpires } = useUser();
    const [categories, setCategories] = useState<any[]>([]);

    const isTokenExpired = () => {
        if (!tokenExpires) return true;
        return Date.now() >= tokenExpires;
    };

    const fetchCategories = async () => {
        setIsLoading(true);
        if (isTokenExpired()) {
            const refreshSuccess = await refreshAccessToken();
            if (!refreshSuccess) {
                setError('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
                setIsLoading(false);
                return;
            }
        }
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté');
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_RESTAURANT_API}/restaurant-type`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            const { data } = await response.json();

            if (response.ok) {
                setCategories(data);
                console.log('Catégories récupérées avec succès');
            } else if (response.status === 401) {
                console.log('Token expiré, tentative de rafraîchissement');
                const refreshSuccess = await refreshAccessToken();
                if (refreshSuccess) {
                    console.log('Token rafraîchi avec succès');
                    await fetchCategories();
                } else {
                    setError('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
                    console.log('Échec du rafraîchissement du token');
                }
            }  else {
                setError('Erreur lors de la récupération des catégories');
            }
        }  catch (err) {
            setError('Une erreur est survenue lors de la récupération des catégories');
            console.error('Erreur de récupération des catégories:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        isLoading,
        error,
    };
}
export default useCategories;