import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import CustomTabs from '../Components/CustomTabs';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useCart } from '../Context/CartContext';
import styles from '../assets/Styles/MenuStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

const RestaurantMenuScreen = ({ route, navigation }: any) => {
    const { restaurant } = route.params;
    const [setCurrentLocation] = useState<any>(null);
    const [address, setAddress] = useState('Chargement de votre adresse...');

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

    const [selectedCategory, setSelectedCategory] = useState<'all' | 'Entrée' | 'Plat' | 'Dessert' | 'Boisson'>('all');

    const [filters, setFilters] = useState({ glutenFree: false, vegan: false, lowCalorie: false });

    const [menuItems] = useState([
        { id: '1', name: 'Bruschetta', category: 'Entrée', price: 6, image: require('../assets/pizza.jpg'), restaurantId: '1', ingredients: ['Pain', 'Tomates', 'Basilic', 'Huile d’olive', 'Ail'], calories: 250, description: 'Une entrée italienne savoureuse.', isGlutenFree: false, isVegan: true, isLowCalorie: true },
        { id: '2', name: 'Margherita', category: 'Plat', price: 10, image: require('../assets/pizza.jpg'), restaurantId: '1', ingredients: ['Pâte à pizza', 'Sauce tomate', 'Mozzarella', 'Basilic'], calories: 700, description: 'Une pizza classique avec une mozzarella fondante.', isGlutenFree: true, isVegan: false, isLowCalorie: true },
        { id: '3', name: 'Sushi Mix', category: 'Plat', price: 18, image: require('../assets/sushi.jpg'), restaurantId: '2', ingredients: ['Saumon', 'Riz', 'Avocat', 'Algue'], calories: 400, description: 'Un assortiment de sushis frais.', isGlutenFree: true, isVegan: false, isLowCalorie: true },
        { id: '4', name: 'California Roll', category: 'Plat', price: 14, image: require('../assets/sushi.jpg'), restaurantId: '2', ingredients: ['Riz', 'Avocat', 'Concombre', 'Crabe'], calories: 350, description: 'Un rouleau de sushi populaire.', isGlutenFree: true, isVegan: false, isLowCalorie: true },
        { id: '5', name: 'Cheeseburger', category: 'Plat', price: 9, image: require('../assets/burger.jpg'), restaurantId: '3', ingredients: ['Pain', 'Bœuf', 'Fromage', 'Salade'], calories: 850, description: 'Un burger au fromage fondant.', isGlutenFree: false, isVegan: false, isLowCalorie: false },
        { id: '6', name: 'Nems', category: 'Entrée', price: 8, image: require('../assets/asian.jpg'), restaurantId: '4', ingredients: ['Feuille de riz', 'Porc', 'Carotte', 'Champignon'], calories: 300, description: 'Nems frits croustillants.', isGlutenFree: false, isVegan: false, isLowCalorie: true },
        { id: '7', name: 'Coca-Cola', category: 'Boisson', price: 3, image: require('../assets/drink.jpg'), restaurantId: '1', ingredients: ['Eau gazéifiée', 'Sucre', 'Extraits végétaux', 'Caféine'], calories: 140, volume: 330, description: 'Un soda rafraîchissant.', isGlutenFree: true, isVegan: true, isLowCalorie: true }
    ]);

    const menuForRestaurant = menuItems.filter(item => item.restaurantId === restaurant.id);

    const categories = [
        { key: 'all', label: 'Tout' },
        { key: 'Entrée', label: 'Entrées' },
        { key: 'Plat', label: 'Plats' },
        { key: 'Dessert', label: 'Desserts' },
        { key: 'Boisson', label: 'Boissons' }
    ];

    const toggleFilter = (filter: keyof typeof filters) => {
        setFilters((prevFilters) => ({ ...prevFilters, [filter]: !prevFilters[filter] }));
    };

    const filteredMenu = menuForRestaurant.filter(item => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (filters.glutenFree && !item.isGlutenFree) return false;
        if (filters.vegan && !item.isVegan) return false;
        if (filters.lowCalorie && !item.isLowCalorie) return false;
        return true;
    });

    const { getItemsNumber } = useCart();
    const itemsNumber = getItemsNumber();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
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
            <Text style={styles.title}>{restaurant.name} - Menu</Text>
            <CustomTabs
                tabs={categories}
                activeTab={selectedCategory}
                onTabChange={(key: string) => {
                    if (['all', 'Entrée', 'Plat', 'Dessert', 'Boisson'].includes(key)) {
                        setSelectedCategory(key as 'all' | 'Entrée' | 'Plat' | 'Dessert' | 'Boisson');
                    }
                }}
            />
            <View style={styles.filtersContainer}>
                <View style={styles.filterRow}>
                    <Checkbox value={filters.glutenFree} onValueChange={() => toggleFilter('glutenFree')} style={styles.checkbox} />
                    <Text style={styles.filterText} onPress={() => toggleFilter('glutenFree')}>Sans Gluten</Text>
                </View>

                <View style={styles.filterRow}>
                    <Checkbox value={filters.vegan} onValueChange={() => toggleFilter('vegan')} style={styles.checkbox} />
                    <Text style={styles.filterText} onPress={() => toggleFilter('vegan')}>Végan</Text>
                </View>

                <View style={styles.filterRow}>
                    <Checkbox value={filters.lowCalorie} onValueChange={() => toggleFilter('lowCalorie')} style={styles.checkbox} />
                    <Text style={styles.filterText} onPress={() => toggleFilter('lowCalorie')}>Faible Calories</Text>
                </View>
            </View>

            <FlatList
                data={filteredMenu}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => navigation.navigate('ProductDetails', { product: item })}
                    >
                        <Image source={item.image} style={styles.menuImage} />
                        <View style={styles.menuInfo}>
                            <Text style={styles.menuName}>{item.name}</Text>
                            <Text style={styles.menuPrice}>{item.price} €</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

export default RestaurantMenuScreen;
