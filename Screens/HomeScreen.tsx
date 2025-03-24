import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import CustomTabs from '../Components/CustomTabs';
import { useCart } from '../Context/CartContext';
import styles from '../assets/Styles/HomeStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../assets/Styles/colors';

const HomeScreen = ({ navigation }: any) => {
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [address, setAddress] = useState('Chargement de votre adresse...');
    const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [maxDistance, setMaxDistance] = useState(50);

    const [restaurants] = useState(Array.from({ length: 50 }, (_, index) => ({
        id: (index + 1).toString(),
        name: `Restaurant ${index + 1}`,
        address: `${index + 1} Rue Exemple, Ville`,
        category: index % 2 === 0 ? 'Pizza' : 'Sushi',
        image: require('../assets/pizza.jpg'),
        latitude: 50.6244 + Math.random() * 0.7,
        longitude: 3.0679 + Math.random() * 0.7,
    })));

    const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location.coords);

            let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
            if (reverseGeocode.length > 0) {
                let addressString = `${reverseGeocode[0].street}, ${reverseGeocode[0].city}`;
                setAddress(addressString);
            }
        })();

        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const favorites = await AsyncStorage.getItem('favoriteRestaurants');
            if (favorites) {
                setFavoriteRestaurants(JSON.parse(favorites));
            }
        } catch (error) {
            console.error('Erreur lors du chargement des favoris :', error);
        }
    };

    const saveFavorites = async (favorites: string[]) => {
        try {
            await AsyncStorage.setItem('favoriteRestaurants', JSON.stringify(favorites));
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des favoris :', error);
        }
    };

    const toggleFavorite = (restaurantId: string) => {
        let updatedFavorites;
        if (favoriteRestaurants.includes(restaurantId)) {
            updatedFavorites = favoriteRestaurants.filter(id => id !== restaurantId);
        } else {
            updatedFavorites = [...favoriteRestaurants, restaurantId];
        }
        setFavoriteRestaurants(updatedFavorites);
        saveFavorites(updatedFavorites);
    };

    const uniqueCategories = ['all', ...new Set(restaurants.map(r => r.category))];

    const handleTabChange = (category: 'all' | string) => {
        setSelectedCategory(category);
        applyFilters(category, showFavoritesOnly, maxDistance);
    };

    const applyFilters = (category: 'all' | string, showFavorites: boolean, distance: number) => {
        let result = restaurants;

        if (showFavorites) {
            result = result.filter(r => favoriteRestaurants.includes(r.id));
        }

        if (category !== 'all') {
            result = result.filter(r => r.category === category);
        }

        if (currentLocation) {
            result = result.filter(r => calculateDistance(r) <= distance);
        }

        setFilteredRestaurants(result);
    };

    const toggleFavoritesView = () => {
        setShowFavoritesOnly(!showFavoritesOnly);
        applyFilters(selectedCategory, !showFavoritesOnly, maxDistance);
    };

    const calculateDistance = (restaurant: any) => {
        const R = 6371;
        const dLat = (restaurant.latitude - currentLocation.latitude) * (Math.PI / 180);
        const dLon = (restaurant.longitude - currentLocation.longitude) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(currentLocation.latitude * (Math.PI / 180)) * Math.cos(restaurant.latitude * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const { getItemsNumber } = useCart();
    const itemsNumber = getItemsNumber();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.address}>{address}</Text>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Tabs', { screen: 'Panier' })}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="cart-outline" size={24} color="black" />
                            {itemsNumber > 0 && (
                                <View style={styles.badgeContainer}>
                                    <Text style={styles.badgeText}>{itemsNumber}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un restaurant..."
                />
            </View>

            <View style={styles.favoriteToggleContainer}>
                <TouchableOpacity onPress={toggleFavoritesView}>
                    <Text style={styles.favoriteToggleText}>
                        <Ionicons
                            name={showFavoritesOnly ? "heart" : "heart-outline"}
                            size={28}
                            color={showFavoritesOnly ? "red" : "grey"}
                        />
                        {showFavoritesOnly ? "Afficher tous les restaurants" : "Afficher uniquement les favoris"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.distanceFilterContainer}>
                <Text>Distance maximale : {maxDistance} km</Text>
                <Slider
                    style={{ width: 300, height: 40 }}
                    minimumValue={1}
                    maximumValue={100}
                    step={1}
                    value={maxDistance}
                    onValueChange={(value) => {
                        setMaxDistance(value);
                        applyFilters(selectedCategory, showFavoritesOnly, value);
                    }}
                    minimumTrackTintColor={colors[7]}
                    maximumTrackTintColor="#000000"
                    thumbTintColor={colors[7]}
                />
            </View>

            <CustomTabs
                tabs={uniqueCategories.map(category => ({
                    key: category,
                    label: category === 'all' ? 'Tout' : category,
                }))}
                activeTab={selectedCategory}
                onTabChange={handleTabChange}
            />

            <FlatList
                data={filteredRestaurants}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.restaurantCard}
                        onPress={() => navigation.navigate('RestaurantMenu', { restaurant: item })}
                    >
                        <Image source={item.image} style={styles.restaurantImage} />
                        <View style={styles.restaurantInfo}>
                            <Text style={styles.restaurantName}>{item.name}</Text>
                            <Text style={styles.restaurantAddress}>{item.address}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.favoriteButton}
                            onPress={() => toggleFavorite(item.id)}
                        >
                            <Ionicons
                                name={favoriteRestaurants.includes(item.id) ? 'heart' : 'heart-outline'}
                                size={24}
                                color={favoriteRestaurants.includes(item.id) ? 'red' : 'grey'}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.restaurantList}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;
