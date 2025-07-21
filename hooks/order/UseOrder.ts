import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../Context/UserContext';
import useRefreshToken from '../UseRefreshToken';

const useOrder = () => {
    const { refreshAccessToken } = useRefreshToken();
    const { user, tokenExpires } = useUser();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);

    const isTokenExpired = () => {
        if (!tokenExpires) return true;
        return Date.now() >= tokenExpires;
    };

    const createOrder = async (orderData: any) => {
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
        console.log(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_ORDER_API}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            })
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_ORDER_API}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            console.log(response)

            if (response.status === 201) {
                const data = await response.json();
                setOrder(data);
                console.log('Commande créée avec succès');
                return data;
            } else {
                console.error('Erreur lors de la création de la commande')
                setError('Erreur lors de la création de la commande');
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la création de la commande');
            console.error('Erreur de création de la commande:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getOrderById = async (id: number) => {
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
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_ORDER_API}/orders/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const { data } = await response.json();
                setOrder(data);
                console.log('Commande récupérée avec succès');
                return data;
            } else {
                setError('Erreur lors de la récupération de la commande');
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la récupération de la commande');
            console.error('Erreur de récupération de la commande:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getOrdersByClientId = async (clientId: number, page: number = 1, limit: number = 10) => {
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
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_ORDER_API}/orders/client/${clientId}?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const { data } = await response.json();
                console.log(data.orders)
                if (data && data.orders) {
                    setOrders(data.orders);
                    console.log('Commandes du client récupérées avec succès');
                } else {
                    setError('Aucune commande trouvée.');
                }
            } else {
                setError('Erreur lors de la récupération des commandes du client');
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la récupération des commandes');
            console.error('Erreur de récupération des commandes:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createOrder,
        getOrderById,
        getOrdersByClientId,
        isLoading,
        error,
        order,
        orders,
    };
};

export default useOrder;
