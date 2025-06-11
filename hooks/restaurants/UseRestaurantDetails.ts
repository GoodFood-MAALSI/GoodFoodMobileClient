import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchRestaurantDetails = async (id: string | number) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Vous devez être connecté');

  const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_RESTAURANT_API}/restaurant/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { data } = await response.json();

  if (!response.ok) throw new Error('Erreur lors de la récupération des détails du restaurant');

  return data;
};

const useRestaurantDetails = (id: string | number) => {
  return useQuery({
    queryKey: ['restaurantDetails', id],
    queryFn: () => fetchRestaurantDetails(id),
    enabled: !!id,
  });
};

export default useRestaurantDetails;
