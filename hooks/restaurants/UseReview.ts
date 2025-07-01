import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useRefreshToken from '../UseRefreshToken';
import { useUser } from '../../Context/UserContext';

const useReview = () => {
    const { refreshAccessToken } = useRefreshToken();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user, tokenExpires } = useUser();

    const isTokenExpired = () => {
        if (!tokenExpires) return true;
        return Date.now() >= tokenExpires;
    };

    const addReview = async (review: any, restaurantId:any) => {
        review.clientId = user.id;
        review.restaurantId = restaurantId;
        console.log(review)
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
            return;
        }

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_RESTAURANT_API}/client-review-restaurant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(review),
            });

            const { data } = await response.json();
            console.log(data)
            if (response.ok) {
                console.log('Review ajouté avec succès');
            } else if (response.status === 401) {
                console.log('Token expiré, tentative de rafraîchissement');
                const refreshSuccess = await refreshAccessToken();
                if (refreshSuccess) {
                    console.log('Token rafraîchi avec succès');
                    await addReview(review);
                } else {
                    setError('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
                    console.log('Échec du rafraîchissement du token');
                }
            } else {
                setError("Erreur lors de l'ajout de la review");
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la récupération des catégories');
            console.error('Erreur de récupération des catégories:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        addReview,
        isLoading,
        error
    };
};

export default useReview;