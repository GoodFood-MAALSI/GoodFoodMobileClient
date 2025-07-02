import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../Context/UserContext';
import useRefreshToken from '../UseRefreshToken';

const useReview = () => {
    const { refreshAccessToken } = useRefreshToken();
    const { user } = useUser();
    const [reviews, setReviews] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isTokenExpired = () => {
        if (!user?.tokenExpires) return true;
        return Date.now() >= user.tokenExpires;
    };

    const addReview = async (review: any, restaurantId: any) => {
        review.clientId = user.id;
        review.restaurantId = restaurantId;
        console.log(review)
        if (isTokenExpired()) {
            const refreshSuccess = await refreshAccessToken();
            if (!refreshSuccess) {
                setError('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
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

            if (response.ok) {
                const { data } = await response.json();
                console.log('Review ajouté avec succès', data);
                getReviews()
            } else {
                setError("Erreur lors de l'ajout de la review");
            }
        } catch (err) {
            setError('Une erreur est survenue lors de l\'ajout de la review');
            console.error(err);
        }
    };

    const getReviews = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_RESTAURANT_API}/client-review-restaurant/client/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const { data } = await response.json();
            console.log(data)
            if (response.ok) {
                setReviews(data);
            } else {
                setError('Erreur de récupération des avis');
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la récupération des avis');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteReview = async (id: string) => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté');
            return;
        }

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_RESTAURANT_API}/client-review-restaurant/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setReviews(reviews.filter((review) => review.id !== id));
            } else {
                setError("Erreur lors de la suppression de l'avis");
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la suppression');
            console.error(err);
        }
    };

    return {
        reviews,
        addReview,
        getReviews,
        deleteReview,
        isLoading,
        error,
    };
};

export default useReview;
