import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../Components/CustomButton';
import theme from '../assets/Styles/themes';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useCart } from '../Context/CartContext';
import styles from '../assets/Styles/ProductDetailsStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductDetailsScreen = ({ route, navigation }: any) => {
    const { product } = route.params;
    const [setCurrentLocation] = useState<any>(null);
    const [address, setAddress] = useState('Chargement de votre adresse...');
    const { addItemToCart, getItemsNumber } = useCart();
    const itemsNumber = getItemsNumber();

    const [quantity, setQuantity] = useState(1);

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

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItemToCart(product, product.restaurantId);
        }
        Alert.alert('Produit ajouté', `${quantity} x ${product.name} ajouté(s) au panier.`);
    };

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

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

            <View style={styles.subcontainer}>
                <Image source={product.image} style={styles.productImage} />
                <Text style={styles.title}>{product.name}</Text>
                <Text style={styles.price}>{product.price} €</Text>
                <Text style={styles.description}>{product.description}</Text>

                {product.volume && (
                    <View>
                        <Text style={styles.sectionTitle}>Volume</Text>
                        <Text style={styles.infoText}>{product.volume} ml</Text>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Valeur nutritionnelle</Text>
                <Text style={styles.calories}>{product.calories} kcal</Text>

                <Text style={styles.sectionTitle}>Ingrédients</Text>
                <FlatList
                    data={product.ingredients}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <Text style={styles.ingredientItem}>• {item}</Text>}
                />

                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <CustomButton
                    text={`Ajouter ${quantity} au panier`}
                    onPress={handleAddToCart}
                    backgroundColor={theme.colors.success}
                />
            </View>
        </SafeAreaView>
    );
};

export default ProductDetailsScreen;
