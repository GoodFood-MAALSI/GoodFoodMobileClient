import React, { useState } from 'react';
import { View, Text, Image, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useCart } from "../Context/CartContext";
import theme from '../assets/Styles/themes';
import styles from "../assets/Styles/CartStyles";
import CustomButton from '../Components/CustomButton';

const CartScreen = ({ navigation }: any) => {
    const { cart, clearRestaurantCart, getCartPriceById } = useCart();
    const renderRestaurantCard = ({ item }: any) => {
        console.log("item", item)
        const [restaurantId, { restaurantInfo, items }] = item;
        const restaurantPrice = getCartPriceById(restaurantId);
        const itemsNumber = items.length;

        return (
            <View style={styles.restaurantCardContainer}>
                <View style={styles.topPartContainer}>
                    {restaurantInfo?.image && restaurantInfo?.image.length > 0 && (
                        <Image
                            source={{ uri: process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_RESTAURANT_API + restaurantInfo?.image[0].path }}
                            style={styles.restaurantImage}
                        />
                    )}
                    <View style={styles.restaurantInfo}>
                        <Text style={styles.restaurantTitle}>{restaurantInfo.name}</Text>
                        <Text style={styles.restaurantDetails}>
                            {itemsNumber} articles | {restaurantPrice.toFixed(2)} €
                        </Text>
                    </View>
                </View>

                <View style={styles.bottomPartContainer}>
                    <CustomButton
                        text="Voir le panier"
                        onPress={() => navigation.navigate('RestaurantCart', { restaurantInfo })}
                        backgroundColor={theme.colors.primary}
                        style={styles.actionButton}
                    />
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => clearRestaurantCart(restaurantId)}
                    >
                        <Text style={styles.removeButtonText}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Votre panier ({Object.keys(cart).length} restaurants)</Text>

            {Object.keys(cart).length > 0 ? (
                <FlatList
                    data={Object.entries(cart)}
                    keyExtractor={(item) => item[0]}
                    renderItem={renderRestaurantCard}
                />
            ) : (
                <View>
                    <Text style={styles.emptyCartTextTitle}>Votre panier est vide.</Text>
                    <Text style={styles.emptyCartText}>Ajoutez des articles à votre panier pour les visualiser ici.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default CartScreen;
