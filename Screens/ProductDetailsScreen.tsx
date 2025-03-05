import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import theme from '../assets/styles/themes';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useCart } from '../Context/CartContext';

const ProductDetailsScreen = ({ route, navigation }: any) => {
    const { product } = route.params;
    const [currentLocation, setCurrentLocation] = useState<any>(null);
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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    subcontainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
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
    productImage: {
        width: 250,
        height: 250,
        borderRadius: theme.spacing.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: theme.spacing.fontSize.xl,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
    },
    price: {
        fontSize: theme.spacing.fontSize.lg,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
    },
    description: {
        fontSize: theme.spacing.fontSize.md,
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.spacing.fontSize.md,
        fontWeight: 'bold',
        marginTop: theme.spacing.md,
    },
    calories: {
        fontSize: theme.spacing.fontSize.md,
        color: '#FF5733',
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
    },
    ingredientItem: {
        fontSize: theme.spacing.fontSize.md,
        textAlign: 'center',
        marginVertical: 2,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    quantityButton: {
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    quantityButtonText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: theme.spacing.fontSize.md,
        fontWeight: 'bold',
        color: theme.colors.text
    },
    backButton: {
        padding: 10,
        marginRight: 10,
    },    
});

export default ProductDetailsScreen;
