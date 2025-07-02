import React, { useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useCart } from "../Context/CartContext";
import { useUser } from '../Context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useOrder from '../hooks/order/UseOrder';
import styles from '../assets/Styles/RestaurantCartStyles';

const RestaurantCartScreen = ({ route, navigation }: any) => {
    const { restaurantInfo } = route.params;
    const { getRestaurantCart, updateItemQuantity, removeItemFromCart, getCartPriceById } = useCart();
    const { user } = useUser();
    const { createOrder, isLoading, error } = useOrder();

    const restaurantCart = getRestaurantCart(restaurantInfo.id);
    const restaurantPrice = getCartPriceById(restaurantInfo.id);

    const handleRemoveItem = (productId: string) => {
        Alert.alert(
            "Supprimer l'article",
            "Êtes-vous sûr de vouloir supprimer cet article ?",
            [
                { text: "Annuler", style: "cancel" },
                { text: "Supprimer", onPress: () => removeItemFromCart(productId, restaurantInfo.id), style: "destructive" },
            ]
        );
    };

    const handleIncreaseQuantity = (productId: string) => {
        updateItemQuantity(productId, restaurantInfo.id, 1);
    };

    const handleDecreaseQuantity = (productId: string, quantity: number) => {
        if (quantity === 1)
            handleRemoveItem(productId);
        else
            updateItemQuantity(productId, restaurantInfo.id, -1);
    };

    const handleValidateCommand = async () => {
        const clientId = user.id;
        const restaurantId = restaurantInfo.id;
        const formattedItems = restaurantCart.map((item) => {
            return {
                menu_item_id: item.id,
                quantity: item.quantity,
                unit_price: parseFloat(item.price),
                selected_option_value_ids: Object.values(item?.selectedOptions).flat(),
                notes: item.description || ""
            };
        });

        const address = await AsyncStorage.getItem('address');
        const geoData = address ? address.split(",") : [];

        const [street, city, postalCode, country] = geoData;
        const streetNumber = street ? street.split(" ")[0] : "";
        const streetName = street ? street.split(" ").slice(1).join(" ") : "";

        const totalPrice = restaurantPrice.toFixed(2);

        const orderData = {
            client_id: clientId,
            restaurant_id: restaurantId,
            status_id: 1,
            description: "Livraison rapide souhaitée",
            subtotal: parseFloat(totalPrice),
            delivery_costs: 4.5,
            service_charge: 2,
            global_discount: 5,
            street_number: streetNumber,
            street: streetName,
            city: city,
            postal_code: postalCode,
            country: country,
            long: 16,
            lat: 16,
            items: formattedItems
        };

        console.log("Order Data: ", JSON.stringify(orderData, null, 2));

        await createOrder(orderData);
        if (error) {
            Alert.alert('Erreur', `Une erreur est survenue lors de la création de la commande: ${error}`);
        } else {
            restaurantCart.forEach((item) => {
                removeItemFromCart(item.id, restaurantInfo.id);
            });
            Alert.alert('Commande réussie', 'Votre commande a été validée avec succès!');
            navigation.navigate('Tabs', { screen: 'Accueil' })
        }
    };

    const renderCartItem = ({ item }: any) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price} €</Text>

            <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id, item.quantity)}>
                    <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)}>
                    <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Panier de {restaurantInfo.name}</Text>

            <FlatList
                data={restaurantCart}
                keyExtractor={(item) => item.id}
                renderItem={renderCartItem}
                ListFooterComponent={
                    <View style={styles.footerContainer}>
                        <Text style={styles.totalPrice}>Prix total : {restaurantPrice.toFixed(2)} €</Text>
                        <TouchableOpacity style={styles.orderButton} onPress={handleValidateCommand}>
                            <Text style={styles.orderButtonText}>Commander</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default RestaurantCartScreen;
