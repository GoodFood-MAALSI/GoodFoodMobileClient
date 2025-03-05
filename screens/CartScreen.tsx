import React from "react";
import { View, Text, Image, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useCart } from "../CartContext";
import theme from '../assets/styles/themes';

const CartScreen = ({ navigation }: any) => {
    const { cart, getItemsNumber, getCartPrice, getCartPriceById } = useCart();
    const itemsNumber = getItemsNumber();
    const totalPrice = getCartPrice();

    const renderCartItem = ({ item }: any) => (
        <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>{item.price} €</Text>
                <Text style={styles.quantity}>Quantité : {item.quantity}</Text>
            </View>
        </View>
    );

    const renderRestaurantCart = ({ item }: any) => {
        const [restaurantId, items] = item;
        const restaurantPrice = getCartPriceById(restaurantId);

        return (
            <View key={restaurantId} style={styles.restaurantContainer}>
                <Text style={styles.restaurantTitle}>Restaurant : {restaurantId}</Text>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCartItem}
                />
                <Text style={styles.totalPriceText}>
                    Prix : {restaurantPrice.toFixed(2)} €
                </Text>
                <CustomButton
                    text="Payer"
                    onPress={() => console.log("panier payé pour: ", { restaurantId })}
                    backgroundColor={theme.colors[8]}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Votre panier ({itemsNumber} articles)</Text>

            {Object.keys(cart).length > 0 ? (
                <FlatList
                    data={Object.entries(cart)}
                    keyExtractor={(item) => item[0]}
                    renderItem={renderRestaurantCart}
                />
            ) : (
                <View>
                    <Text style={styles.emptyCartTextTitle}>Votre panier est vide.</Text>
                    <Text style={styles.emptyCartText}>Ajouter des articles à votre panier pour les visualiser ici.</Text>
                    <CustomButton
                        text="Commander"
                        onPress={() => navigation.navigate("Accueil")}
                        backgroundColor={theme.colors[6]}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    headerText: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    restaurantContainer: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#EFEFEF',
    },
    restaurantTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    price: {
        fontSize: 16,
        color: '#FF6B6B',
        fontWeight: '600',
    },
    quantity: {
        fontSize: 14,
        color: '#555',
    },
    totalPriceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    emptyCartTextTitle: {
        fontSize: 30,
        color: 'black',
        textAlign: 'center',
        marginTop: 50,
        fontWeight: 'bold',
    },
    emptyCartText: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default CartScreen;
