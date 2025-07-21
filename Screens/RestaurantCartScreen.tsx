import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, Image, Modal, FlatList } from 'react-native';
import { useCart } from "../Context/CartContext";
import { useUser } from '../Context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useOrder from '../hooks/order/UseOrder';
import styles from '../assets/Styles/RestaurantCartStyles';
import MapView, { Marker } from 'react-native-maps';
import useTrackingOrder from '../hooks/tracking/useTrackingOrder';

const RestaurantCartScreen = ({ route, navigation }: any) => {
    const { restaurantInfo } = route.params;
    const { getRestaurantCart, removeItemFromCart, getCartPriceById } = useCart();
    const { user } = useUser();
    const { createOrder, getOrderById, isLoading, error, order } = useOrder();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [orderId, setOrderId] = useState<any>(null);
    const [livreurId, setLivreurId] = useState<any>(null);
    const [verificationCode, setVerificationCode] = useState<any>(null);
    const [orderStatus, setOrderStatus] = useState<number>(1);
    const [orderLocation, setOrderLocation] = useState({ latitude: 0, longitude: 0 });
    const [restaurantLocation, setrestaurantLocation] = useState({ latitude: 0, longitude: 0 });

    const restaurantCart = getRestaurantCart(restaurantInfo.id);
    const restaurantPrice = getCartPriceById(restaurantInfo.id);

    const { livreurLocation } = useTrackingOrder(livreurId);

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
            const data = await createOrder(orderData);
            if (error) {
                Alert.alert('Erreur', `Une erreur est survenue lors de la création de la commande: ${error}`);
            } else {
                restaurantCart.forEach((item) => {
                    removeItemFromCart(item.id, restaurantInfo.id);
                });
                Alert.alert('Commande réussie', 'Votre commande a été validée avec succès!');
                setOrderId(data.data.id);
                setOrderLocation({
                    latitude: data.data.lat,
                    longitude: data.data.long,
                });
                setrestaurantLocation({
                    latitude: data.data.restaurant.lat,
                    longitude: data.data.restaurant.long,
                });
                console.log("Commande créée avec succès. Order ID:", data.data.id);
                setIsModalVisible(true);
                navigation.navigate('Tabs', { screen: 'Accueil' })
            }
        } else {
            Alert.alert("Erreur", "L'adresse sélectionnée n'est pas valide.");
        }
    };

    const pollOrderStatus = (id: number) => {
        const intervalId = setInterval(async () => {
            const data = await getOrderById(id);
            console.log("Status actuel de la commande:", data.status_id);

            if (data.status_id === 3) {
                console.log('Commande terminée, statut 3 atteint');
                clearInterval(intervalId);

                if (data.deliverer_id) {
                    console.log('Déclenchement du suivi du livreur avec l\'ID:', data.deliverer_id);
                    setLivreurId(data.deliverer_id);
                    setVerificationCode(data.delivery.verification_code);
                    setOrderStatus(data.status_id);
                }
            }
        }, 10000);
    };

    useEffect(() => {
        if (orderId && !livreurId) {
            pollOrderStatus(orderId);
        }
    }, [orderId]);

    const renderCartItem = ({ item }: any) => {
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

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>

                    <MapView
                        style={styles.mapView}
                        initialRegion={{
                            latitude: livreurLocation?.coordinates[1] || 50.6357,
                            longitude: livreurLocation?.coordinates[0] || 3.0601,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >

                        <>
                            {livreurLocation && (
                                <Marker
                                    coordinate={{
                                        latitude: livreurLocation.coordinates[1],
                                        longitude: livreurLocation.coordinates[0]
                                    }}
                                    title="Livreur"
                                    pinColor="blue"
                                    description="Position actuelle du livreur"
                                />
                            )}
                            {orderLocation.latitude !== 0 && orderLocation.longitude !== 0 && (
                                <Marker
                                    coordinate={{
                                        latitude: orderLocation.latitude,
                                        longitude: orderLocation.longitude,
                                    }}
                                    title="Lieu de livraison"
                                    pinColor="red"
                                    description="Adresse de livraison"
                                />
                            )}
                            {restaurantLocation.latitude !== 0 && restaurantLocation.longitude !== 0 && (
                                <Marker
                                    coordinate={{
                                        latitude: restaurantLocation.latitude,
                                        longitude: restaurantLocation.longitude,
                                    }}
                                    title="Restaurant"
                                    pinColor="green"
                                    description="Adresse du restaurant"
                                />
                            )}
                        </>
                    </MapView>
                    {orderStatus === 3 ? (
                        <Text style={styles.verificationCode}>
                            Code de vérification : {verificationCode}
                        </Text>
                    ) : (
                        <Text style={styles.waitingText}>Votre commande n'a pas encore été prise en charge par un livreur</Text>
                    )}
                </SafeAreaView>
            </Modal >
        </SafeAreaView >
    );
};

export default RestaurantCartScreen;
