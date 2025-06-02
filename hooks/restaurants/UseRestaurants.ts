import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchRestaurants = async (searchQuery: string) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Vous devez être connecté');

  const queryParams = new URLSearchParams();
  if (searchQuery) {
    queryParams.append('name', searchQuery);
  }

  const url = `${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_RESTAURANT_API}/restaurant?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { data } = await response.json();
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des restaurants');
  }

  return data;
};

export const useRestaurants = (searchQuery: string) => {
  const {
    data: restaurantsData,
    error,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['restaurants', searchQuery],
    queryFn: () => fetchRestaurants(searchQuery),
  });

  const restaurants = restaurantsData?.restaurants || [];
  const filteredRestaurants = restaurantsData?.restaurants || [];
  const pagination = restaurantsData?.meta || {};

  console.log(restaurants)

  return {
    restaurants,
    filteredRestaurants,
    isLoading,
    error,
    pagination,
    refetch,
    isFetching,
    isError,
  };
};
