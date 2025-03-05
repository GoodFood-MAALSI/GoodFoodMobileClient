import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import CustomTabs from '../Components/CustomTabs';
import { useCart } from '../Context/CartContext';
import styles from '../Assets/Styles/HomeStyles';

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

export default HomeScreen;
