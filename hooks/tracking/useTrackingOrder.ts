import { useState, useEffect, useRef } from 'react';
import { useUser } from '../../Context/UserContext';
import useRefreshToken from '../UseRefreshToken';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useTrackingOrder = (livreurId: number) => {
    const { user, tokenExpires } = useUser();
    const { refreshAccessToken } = useRefreshToken();
    const [livreurLocation, setLivreurLocation] = useState<any>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const isTokenExpired = () => {
        if (!tokenExpires) return true;
        return Date.now() >= tokenExpires;
    };

    const fetchDelivererLocation = async (livreurId: number) => {
        console.log("Fetching deliverer location...");

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token manquant');
                throw new Error('Token manquant');
            }

            console.log(`Fetching location for livreur ${livreurId}`);

            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_DELIVERY_API}/tracking/latest/${livreurId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const { data } = await response.json();
            if (data && data.location && Array.isArray(data.location.coordinates)) {
                console.log("Deliverer location fetched:", data.location);
                setLivreurLocation(data.location);
            } else {
                console.error("Invalid data format:", data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la position du livreur:', error);
        }
    };

    const startTrackingDeliverer = () => {
        console.log("Starting deliverer tracking...");

        if (livreurId) {
            intervalRef.current = setInterval(() => {
                console.log("Tracking deliverer...");
                fetchDelivererLocation(livreurId);
            }, 30000);
        }
    };

    useEffect(() => {
        console.log(`Starting tracking for livreur ID: ${livreurId}`);

        startTrackingDeliverer();

        return () => {
            console.log("Cleaning up tracking interval");
            clearInterval(intervalRef.current!);
        };
    }, [livreurId]);
    return { livreurLocation };
};

export default useTrackingOrder;
