import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchRestaurants = async (searchQuery: string, lat?: number, long?: number, perimeter?: number) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Vous devez être connecté');

  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.append('name', searchQuery);
  if (lat) queryParams.append('lat', lat.toString());
  if (long) queryParams.append('long', long.toString());
  if (perimeter) queryParams.append('perimeter', (perimeter * 1000).toString());
  const url = `${process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_RESTAURANT_API}/restaurant?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { data } = await response.json();
  if (!response.ok)
    throw new Error('Erreur lors de la récupération des restaurants');

  return data;
};

export const useRestaurants = (searchQuery: string, lat?: number, long?: number, perimeter?: number) => {
  const {
    data: restaurantsData,
    ...rest
  } = useQuery({
    queryKey: ['restaurants', searchQuery, lat, long, perimeter],
    queryFn: () => fetchRestaurants(searchQuery, lat, long, perimeter),
  });

  return {
    restaurants: restaurantsData?.restaurants || [],
    filteredRestaurants: restaurantsData?.restaurants || [],
    pagination: restaurantsData?.meta || {},
    ...rest,
  };
};
