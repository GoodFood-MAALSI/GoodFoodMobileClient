import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useRefreshToken from '../UseRefreshToken';
import { useUser } from '../../Context/UserContext';

export default function useSearchHistory() {
    const { refreshAccessToken } = useRefreshToken();
    const { tokenExpires } = useUser();
    const [history, setHistory] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const isTokenExpired = () => !tokenExpires || Date.now() >= tokenExpires;

    const getToken = async () => {
        if (isTokenExpired()) {
            const ok = await refreshAccessToken();
            if (!ok) return null;
        }
        return await AsyncStorage.getItem('token');
    };

    const fetchHistory = async () => {
        const token = await getToken();
        if (!token) return;

        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_CLIENT_API}/user-search-history/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const { data } = await res.json();
            setHistory(data || []);
        } catch (err) {
            setError('Erreur récupération historique');
        }
    };

    const addHistory = async (search_query: string) => {
        const token = await getToken();
        if (!token) return;

        try {
            await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_CLIENT_API}/user-search-history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ search_query }),
            });
            fetchHistory();
        } catch (err) {
            setError("Erreur ajout historique");
        }
    };

    const deleteHistory = async (id: string) => {
        const token = await getToken();
        if (!token) return;

        await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_CLIENT_API}/user-search-history/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchHistory();
    };

    const clearAllHistory = async () => {
        const token = await getToken();
        if (!token) return;

        await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_CLIENT_API}/user-search-history`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchHistory();
    };

    useEffect(() => { fetchHistory(); }, []);

    return { history, addHistory, deleteHistory, clearAllHistory, error };
}
