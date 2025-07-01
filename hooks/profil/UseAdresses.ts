import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useRefreshToken from '../UseRefreshToken';
import { useUser } from '../../Context/UserContext';

const useUserAddresses = () => {
    const { refreshAccessToken } = useRefreshToken();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user, tokenExpires } = useUser();

    const isTokenExpired = () => {
        if (!tokenExpires) return true;
        return Date.now() >= tokenExpires;
    };

    const fetchAddresses = async () => {
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
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_CLIENT_API}/user-addresses/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { data } = await response.json();
            if (response.ok) {
                setAddresses(data);
                console.log('Adresses récupérées avec succès');
            } else if (response.status === 401) {
                console.log('Token expiré, tentative de rafraîchissement');
                const refreshSuccess = await refreshAccessToken();
                if (refreshSuccess) {
                    console.log('Token rafraîchi avec succès');
                    await fetchAddresses();
                } else {
                    setError('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
                    console.log('Échec du rafraîchissement du token');
                }
            } else {
                setError('Erreur lors de la récupération des adresses');
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la récupération des adresses');
            console.error('Erreur de récupération des adresses:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const addAddress = async (addressData: any) => {
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

        const fullAddress = `${addressData.street_number || ''}+${addressData.street || ''}+${addressData.postal_code || ''}+${addressData.city || ''}`;
        try {
            const verificationRes = await fetch(`https://api-adresse.data.gouv.fr/search/?type=housenumber&q=${encodeURIComponent(fullAddress)}&limit=1`);
            const verificationData = await verificationRes.json();

            const found = verificationData?.features?.[0];
            if (!found || verificationData.features.length === 0 || found.properties?.score < 0.5) {
                setError("Adresse non reconnue. Veuillez vérifier l'exactitude.");
                return;
            }
        } catch (err) {
            console.error("Erreur lors de la vérification de l'adresse:", err);
            setError("Impossible de valider l'adresse. Veuillez réessayer plus tard.");
            return;
        }

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_CLIENT_API}/user-addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(addressData),
            });

            const { data } = await response.json();

            if (response.ok) {
                console.log('Adresse ajoutée avec succès');
                fetchAddresses();
            } else if (response.status === 401) {
                console.log('Token expiré, tentative de rafraîchissement');
                const refreshSuccess = await refreshAccessToken();
                if (refreshSuccess) {
                    console.log('Token rafraîchi avec succès');
                    await addAddress(addressData);
                } else {
                    setError('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
                }
            } else {
                setError("Erreur lors de l'ajout de l'adresse");
                console.error('Erreur ajout adresse:', data);
            }
        } catch (err) {
            setError("Erreur de réseau lors de l'ajout de l'adresse");
            console.error("Erreur réseau ajout adresse:", err);
        }
    };

    const updateAddress = async (id: string, addressData: any) => {
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
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_CLIENT_API}/user-addresses/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(addressData),
            });

            const { data } = await response.json();

            if (response.ok) {
                console.log('Adresse mise à jour avec succès');
                fetchAddresses();
            } else if (response.status === 401) {
                console.log('Token expiré, tentative de rafraîchissement');
                const refreshSuccess = await refreshAccessToken();
                if (refreshSuccess) {
                    console.log('Token rafraîchi avec succès');
                    await updateAddress(id, addressData);
                } else {
                    setError('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
                    console.log('Échec du rafraîchissement du token');
                }
            } else {
                setError('Erreur lors de la mise à jour de l\'adresse');
                console.error('Erreur mise à jour adresse:', data);
            }
        } catch (err) {
            setError('Erreur de réseau lors de la mise à jour de l\'adresse');
            console.error('Erreur réseau mise à jour adresse:', err);
        }
    };

    const deleteAddress = async (id: string) => {
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
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_CLIENT_API}/user-addresses/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let data = {};
            if (response.status !== 204) {
                data = await response.json();
            }
            if (response.ok) {
                console.log('Adresse supprimée avec succès');
                fetchAddresses();
            } else if (response.status === 401) {
                console.log('Token expiré, tentative de rafraîchissement');
                const refreshSuccess = await refreshAccessToken();
                if (refreshSuccess) {
                    console.log('Token rafraîchi avec succès');
                    await deleteAddress(id);
                } else {
                    setError('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
                    console.log('Échec du rafraîchissement du token');
                }
            } else {
                setError('Erreur lors de la suppression de l\'adresse');
                console.error('Erreur suppression adresse:', data);
            }
        } catch (err) {
            setError('Erreur de réseau lors de la suppression de l\'adresse');
            console.error('Erreur réseau suppression adresse:', err);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return {
        addresses,
        isLoading,
        error,
        addAddress,
        updateAddress,
        deleteAddress,
    };
};

export default useUserAddresses;
