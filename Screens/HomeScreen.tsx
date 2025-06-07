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
import useUserAddresses from '../hooks/profil/UseAdresses';
import useCategories from '../hooks/restaurants/UseCategories';

const HomeScreen = ({ navigation }: any) => {
    const [geoAddress, setGeoAddress] = useState('Chargement de votre adresse...');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<any[]>([]);
    const [maxDistance, setMaxDistance] = useState(50);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);

    const { filteredRestaurants, isLoading } = useRestaurants(searchQuery, 15.9, 15.9, maxDistance);
    const { addresses } = useUserAddresses();
    const { categories } = useCategories();

    const formattedCategories = ['all', ...categories.map(c => c.name)];

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({});

            let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
            if (reverseGeocode.length > 0) {
                const adr = `${reverseGeocode[0].streetNumber || ''} ${reverseGeocode[0].street || ''}, ${reverseGeocode[0].city || ''}`.trim();
                setGeoAddress(adr);
                if (!selectedAddress) setSelectedAddress(adr);
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


    const handleTabChange = (category: any) => {
        setSelectedCategory(category);
    };

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
                        key: category,
                        label: category === 'all' ? 'Tout' : category,
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
                            <Text style={styles.restaurantAddress}>{item.street_number} {item.street}, {item.city}</Text>
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
