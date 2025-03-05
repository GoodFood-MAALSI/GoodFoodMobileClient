import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import CustomTabs from '../components/CustomTabs';
import { useCart } from '../CartContext';

const HomeScreen = ({ navigation }: any) => {
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [address, setAddress] = useState('Chargement de votre adresse...');
    const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');

    const [restaurants] = useState(Array.from({ length: 50 }, (_, index) => ({
        id: (index + 1).toString(),
        name: `Restaurant ${index + 1}`,
        address: `${index + 1} Rue Exemple, Ville`,
        category: index % 2 === 0 ? 'Pizza' : 'Sushi',
        image: require('../assets/pizza.jpg'),
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
    }, []);

    const uniqueCategories = ['all', ...new Set(restaurants.map(r => r.category))];

    const handleTabChange = (category: 'all' | string) => {
        setSelectedCategory(category);
        setFilteredRestaurants(category === 'all' ? restaurants : restaurants.filter(r => r.category === category));
    };

    const { getItemsNumber } = useCart();
        const itemsNumber = getItemsNumber();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.address}>{address}</Text>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
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
                        key={item.id}
                        style={styles.restaurantCard}
                        onPress={() => navigation.navigate('RestaurantMenu', { restaurant: item })}
                    >
                        <Image source={item.image} style={styles.restaurantImage} />
                        <View style={styles.restaurantInfo}>
                            <Text style={styles.restaurantName}>{item.name}</Text>
                            <Text style={styles.restaurantAddress}>{item.address}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.restaurantList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F5F5F5',
    },
    address: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    iconsContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    searchContainer: {
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    restaurantList: {
        padding: 15,
    },
    restaurantCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    restaurantImage: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    restaurantInfo: {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    restaurantAddress: {
        fontSize: 14,
        color: '#666',
    },
    iconContainer: {
        position: 'relative',
    },
    badgeContainer: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
