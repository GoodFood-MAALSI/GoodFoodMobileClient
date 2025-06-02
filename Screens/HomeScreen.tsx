import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import CustomTabs from '../Components/CustomTabs';
import { useCart } from '../Context/CartContext';
import styles from '../assets/Styles/HomeStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../assets/Styles/colors';
import { useRestaurants } from '../hooks/restaurants/UseRestaurants';
import debounce from 'lodash.debounce';
import useUserAddresses from '../hooks/profil/useAdresses';
import profilstyles from '../assets/Styles/ProfilStyles';

const HomeScreen = ({ navigation }: any) => {
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [geoAddress, setGeoAddress] = useState('Chargement de votre adresse...');
    type Category = 'all' | 'Pizza' | 'Sushi' | 'Burgers';
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [maxDistance, setMaxDistance] = useState(50);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);

    const { restaurants, filteredRestaurants, error, isLoading, isFetching } = useRestaurants(searchQuery);
    const { addresses } = useUserAddresses();

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
                const adr = `${reverseGeocode[0].streetNumber || ''} ${reverseGeocode[0].street || ''}, ${reverseGeocode[0].city || ''}`.trim();
                setGeoAddress(adr);
                if (!selectedAddress) setSelectedAddress(adr);
            }
        })();

        // loadFavorites();
    }, []);

    // const loadFavorites = async () => {
    //     try {
    //         const favorites = await AsyncStorage.getItem('favoriteRestaurants');
    //         if (favorites) {
    //             setFavoriteRestaurants(JSON.parse(favorites));
    //         }
    //     } catch (error) {
    //         console.error('Erreur lors du chargement des favoris :', error);
    //     }
    // };

    // const saveFavorites = async (favorites: string[]) => {
    //     try {
    //         await AsyncStorage.setItem('favoriteRestaurants', JSON.stringify(favorites));
    //     } catch (error) {
    //         console.error('Erreur lors de l\'enregistrement des favoris :', error);
    //     }
    // };

    // const toggleFavorite = (restaurantId: string) => {
    //     let updatedFavorites;
    //     if (favoriteRestaurants.includes(restaurantId)) {
    //         updatedFavorites = favoriteRestaurants.filter(id => id !== restaurantId);
    //     } else {
    //         updatedFavorites = [...favoriteRestaurants, restaurantId];
    //     }
    //     setFavoriteRestaurants(updatedFavorites);
    //     saveFavorites(updatedFavorites);
    // };

    // const uniqueCategories = ['all', ...new Set(restaurants.map(r => r.category))];

    // const handleTabChange = (category: Category) => {
    //     setSelectedCategory(category);
    //     applyFilters(category, showFavoritesOnly, maxDistance);
    // };

    // const applyFilters = (category: Category, showFavorites: boolean, distance: number) => {
    //     let result = restaurants;

    //     if (showFavorites) {
    //         result = result.filter(r => favoriteRestaurants.includes(r.id));
    //     }

    //     if (category !== 'all') {
    //         result = result.filter(r => r.category === category);
    //     }

    //     if (currentLocation) {
    //         result = result.filter(r => calculateDistance(r) <= distance);
    //     }

    //     // setFilteredRestaurants(result);
    // };

    // const toggleFavoritesView = () => {
    //     setShowFavoritesOnly(!showFavoritesOnly);
    //     applyFilters(selectedCategory, !showFavoritesOnly, maxDistance);
    // };

    // const calculateDistance = (restaurant: any) => {
    //     const R = 6371;
    //     const dLat = (restaurant.latitude - currentLocation.latitude) * (Math.PI / 180);
    //     const dLon = (restaurant.longitude - currentLocation.longitude) * (Math.PI / 180);
    //     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //         Math.cos(currentLocation.latitude * (Math.PI / 180)) * Math.cos(restaurant.latitude * (Math.PI / 180)) *
    //         Math.sin(dLon / 2) * Math.sin(dLon / 2);
    //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     return R * c;
    // };

    const handleSearchChange = debounce((query: string) => {
        setSearchQuery(query);
    }, 500);

    const { getItemsNumber } = useCart();
    const itemsNumber = getItemsNumber();

    const selectableAddresses = [geoAddress, ...addresses.map(a => `${a.street_number} ${a.street}, ${a.city}`)];

    const handleSelectAddress = (address: string) => {
        setSelectedAddress(address);
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.address} numberOfLines={1}>
                        {selectedAddress || 'Choisissez une adresse'}{' '}
                        <Ionicons name="chevron-down" size={15} color="black" />
                    </Text>
                </TouchableOpacity>

                <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <FlatList
                                data={selectableAddresses}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelectAddress(item)} style={styles.addressItem}>
                                        <Text style={styles.addressItemText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>

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
                    onChangeText={handleSearchChange}
                />
            </View>

            {/* <View style={styles.favoriteToggleContainer}>
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
            </View> */}

            {/* <View style={styles.distanceFilterContainer}>
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
            </View> */}

            {/* <CustomTabs
                tabs={uniqueCategories.map(category => ({
                    key: category as Category,
                    label: category === 'all' ? 'Tout' : category,
                }))}
                activeTab={selectedCategory}
                onTabChange={handleTabChange}
            /> */}

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
                        {/* <TouchableOpacity
                            style={styles.favoriteButton}
                            onPress={() => toggleFavorite(item.id)}
                        >
                            <Ionicons
                                name={favoriteRestaurants.includes(item.id) ? 'heart' : 'heart-outline'}
                                size={24}
                                color={favoriteRestaurants.includes(item.id) ? 'red' : 'grey'}
                            />
                        </TouchableOpacity> */}
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.restaurantList}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;
