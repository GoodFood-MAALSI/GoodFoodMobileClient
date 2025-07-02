import React, { useEffect, useState, useMemo } from 'react';
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
import useUserAddresses from '../hooks/profil/UseAdresses';
import useSearchHistory from '../hooks/profil/UseSearchHistory';
import useCategories from '../hooks/restaurants/UseCategories';

const HomeScreen = ({ navigation }: any) => {
    const [geoAddress, setGeoAddress] = useState('Chargement de votre adresse...');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<any[]>([]);
    const [maxDistance, setMaxDistance] = useState(50);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);
    const [coords, setCoords] = useState<{ latitude: number, longitude: number } | null>(null);
    const { history, addHistory, deleteHistory, clearAllHistory } = useSearchHistory();
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const { filteredRestaurants, isLoading } = useRestaurants(
        searchQuery,
        coords?.latitude ?? 0,
        coords?.longitude ?? 0,
        maxDistance,
        selectedCategoryId
    );
    const { addresses } = useUserAddresses();
    const { categories } = useCategories();

    const formattedCategories = [
        { key: 'all', label: 'Tout', id: null },
        ...categories.map(c => ({
            key: c.name,
            label: c.name,
            id: c.id,
        })),
    ];

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);

            setCoords(location.coords);

            if (reverseGeocode.length > 0) {
                const adr = `${reverseGeocode[0].streetNumber || ''} ${reverseGeocode[0].street || ''}, ${reverseGeocode[0].city || ''}, ${reverseGeocode[0].postalCode || ''}, ${reverseGeocode[0].country || ''}`.trim();
                setGeoAddress(adr);
                if (!selectedAddress) {
                    const addressParts = adr.split(',');
                    const formattedAddress = `${addressParts[0]}, ${addressParts[1]}`.trim();
                    setSelectedAddress(formattedAddress);
                    AsyncStorage.setItem('address', adr);
                }
            }
        })();
    }, []);


    useEffect(() => {
        const loadFavorites = async () => {
            const stored = await AsyncStorage.getItem('favoriteRestaurants');
            if (stored) setFavoriteRestaurants(JSON.parse(stored));
        };
        loadFavorites();
    }, []);

    const toggleFavorite = async (restaurant: any) => {
        try {
            const stored = await AsyncStorage.getItem('favoriteRestaurants');
            const parsed: any[] = stored ? JSON.parse(stored) : [];

            const exists = parsed.find((r) => r.id === restaurant.id);

            let updatedFavorites;
            if (exists) {
                updatedFavorites = parsed.filter((r) => r.id !== restaurant.id);
            } else {
                updatedFavorites = [...parsed, restaurant];
            }

            setFavoriteRestaurants(updatedFavorites);
            await AsyncStorage.setItem('favoriteRestaurants', JSON.stringify(updatedFavorites));
        } catch (error) {
            console.error('Erreur lors du toggle favorite:', error);
        }
    };

    const handleTabChange = (key: string) => {
        const selected = formattedCategories.find(c => c.key === key);
        setSelectedCategory(key);
        setSelectedCategoryId(selected?.id || null);
    };

    useEffect(() => {
        if (searchQuery.length >= 3) {
            addHistory(searchQuery);
        }
    }, [searchQuery]);


    const debouncedUpdateQuery = useMemo(() => {
        return debounce((text: string) => {
            setSearchQuery(text);
        }, 500);
    }, []);

    useEffect(() => {
        return () => debouncedUpdateQuery.cancel();
    }, [debouncedUpdateQuery]);

    const { getItemsNumber } = useCart();
    const itemsNumber = getItemsNumber();

    const selectableAddresses = [geoAddress, ...addresses.map(a => `${a.street_number} ${a.street}, ${a.city}, ${a.postal_code}, ${a.country}`)];

    const handleSelectAddress = (address: string) => {
        setSelectedAddress(address);
        AsyncStorage.setItem('address', address);
        setModalVisible(false);

        const addressParts = address.split(',');
        const formattedAddress = `${addressParts[0]}, ${addressParts[1]}`.trim();
        setSelectedAddress(formattedAddress);
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
            <View style={styles.searchWrapper}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher un restaurant..."
                        placeholderTextColor="#999"
                        value={searchInput}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        onChangeText={(text) => {
                            setSearchInput(text);
                            debouncedUpdateQuery(text);
                        }}
                    />

                </View>

                {isSearchFocused && history.length > 0 && (
                    <View style={styles.historyDropdown}>
                        <View style={styles.historyHeader}>
                            <Text style={styles.historyTitle}>Recherches récentes</Text>
                            <TouchableOpacity onPress={clearAllHistory}>
                                <Text style={styles.clearAllText}>Tout effacer</Text>
                            </TouchableOpacity>
                        </View>
                        {history.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.historyItem}
                                onPress={() => {
                                    setSearchQuery(item.search_query);
                                    addHistory(item.search_query);
                                    setIsSearchFocused(false);
                                }}
                            >
                                <Text style={styles.historyText}>{item.search_query}</Text>
                                <TouchableOpacity onPress={() => deleteHistory(item.id)}>
                                    <Ionicons name="close-outline" size={18} color="#888" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
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
                    }}
                    minimumTrackTintColor={colors[7]}
                    maximumTrackTintColor="#000000"
                    thumbTintColor={colors[7]}
                />
            </View>
            {isLoading ? (
                <Text style={{ textAlign: 'center', marginVertical: 20 }}>Chargement des catégories...</Text>
            ) : (
                <CustomTabs
                    tabs={formattedCategories.map(category => ({
                        key: category.key,
                        label: category.label,
                    }))}
                    activeTab={selectedCategory}
                    onTabChange={handleTabChange}
                />
            )}
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
                            {item.average_rating != null && (
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
                                    <Text style={styles.ratingText}>
                                        {item.average_rating.toFixed(1)}
                                    </Text>
                                </View>
                            )}
                            <Text style={styles.restaurantAddress}>
                                {item.street_number} {item.street}, {item.city}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.favoriteButton}
                            onPress={() => toggleFavorite(item)}
                        >
                            <Ionicons
                                name={favoriteRestaurants.some((fav) => fav.id === item.id)
                                    ? 'heart' : 'heart-outline'}
                                size={24}
                                color={favoriteRestaurants.some((fav) => fav.id === item.id)
                                    ? colors[7] : 'grey'}
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
