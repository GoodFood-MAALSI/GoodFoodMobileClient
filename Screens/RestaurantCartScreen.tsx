import React from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, Alert, Image } from 'react-native';
import { useCart } from "../Context/CartContext";
import { useUser } from '../Context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useOrder from '../hooks/order/UseOrder';
import styles from '../assets/Styles/RestaurantCartStyles';

const RestaurantCartScreen = ({ route, navigation }: any) => {
    const { restaurantInfo } = route.params;
    const { getRestaurantCart, removeItemFromCart, getCartPriceById } = useCart();
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

    const handleValidateCommand = async () => {
        const clientId = user.id;
        const restaurantId = restaurantInfo.id;
        const formattedItems = restaurantCart.map((item) => {
            return {
                menu_item_id: item.id,
                quantity: item.quantity,
                unit_price: parseFloat(item?.price),
                selected_option_value_ids: Object.values(item?.selectedOptions).flat(),
                notes: item.description || ""
            };
        });

        const addressData = await AsyncStorage.getItem('address');

        let addressObj = {};
        if (addressData) {
            addressObj = JSON.parse(addressData);

            const { street_number, street, city, postal_code, country } = addressObj;
            const { lat, long } = addressObj;

            const streetNumber = street_number || '';
            const streetName = street || '';
            const cityName = city || '';
            const postalCode = postal_code || '';
            const countryName = country || '';

            const totalPrice = restaurantPrice.toFixed(2);

            const orderData = {
                client_id: clientId,
                restaurant_id: restaurantId,
                status_id: 1,
                description: "",
                subtotal: parseFloat(totalPrice),
                delivery_costs: 4.5,
                service_charge: 2,
                global_discount: 5,
                street_number: streetNumber,
                street: streetName,
                city: cityName,
                postal_code: postalCode,
                country: countryName,
                long: long,
                lat: lat,
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
        } else {
            Alert.alert("Erreur", "L'adresse sélectionnée n'est pas valide.");
        }
    };

    const renderCartItem = ({ item }: any) => {
        console.log(item.images[0].path)
        let itemPrice = parseFloat(item.price);
        const optionExtras: string[] = [];

        if (item.selectedOptions) {
            Object.keys(item.selectedOptions).forEach(optionId => {
                const selectedOptionValues = item.selectedOptions[optionId];
                selectedOptionValues.forEach(optionValueId => {
                    const option = item.menuItemOptions.find(option => option.id == optionId);
                    const optionValue = option?.menuItemOptionValues.find(value => value.id == optionValueId);
                    if (optionValue && optionValue.extra_price) {
                        itemPrice += parseFloat(optionValue.extra_price);
                        optionExtras.push(`${optionValue.name} (+${parseFloat(optionValue.extra_price).toFixed(2)} €)`);
                    }
                });
            });
        }

        return (
            <View style={styles.itemContainer}>
                <View>
                    {item.images && item.images.length > 0 && (
                        <Image
                            source={{ uri: process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_RESTAURANT_API + item.images[0].path }}
                            style={styles.menuImage}
                        />
                    )}
                </View>
                <View>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{item.price} €</Text>

                    {optionExtras.length > 0 && (
                        <View style={styles.extrasContainer}>
                            {optionExtras.map((extra, index) => (
                                <Text key={index} style={styles.extraPrice}>{extra}</Text>
                            ))}
                        </View>
                    )}
                </View>

                <View>
                    <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Panier de {restaurantInfo.name}</Text>
            {restaurantInfo?.image && restaurantInfo?.image.length > 0 && (
                <Image
                    source={{ uri: process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_RESTAURANT_API + restaurantInfo?.image[0].path }}
                    style={styles.restaurantImage}
                    resizeMode="cover"
                />
            )}

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
