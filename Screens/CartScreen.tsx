import React from "react";
import { View, Text, Image, FlatList, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import CustomButton from '../Components/CustomButton';
import { useCart } from "../Context/CartContext";
import theme from '../assets/Styles/themes';
import styles from "../assets/Styles/CartStyles";

const CartScreen = ({ navigation }: any) => {
    const {
        cart,
        getItemsNumber,
        getCartPrice,
        getCartPriceById,
        clearCart,
        removeItemFromCart,
        clearRestaurantCart,
        updateItemQuantity
    } = useCart();
    const itemsNumber = getItemsNumber();
    const totalPrice = getCartPrice();

    const renderCartItem = ({ item }: any, restaurantId: string) => (
        <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>{item.price} €</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => updateItemQuantity(item.id, restaurantId, item.quantity - 1)}>
                        <Text style={styles.quantityButton}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateItemQuantity(item.id, restaurantId, item.quantity + 1)}>
                        <Text style={styles.quantityButton}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeItemFromCart(item.id, restaurantId)}>
                        <Text style={styles.removeButton}>🗑️</Text>
                    </TouchableOpacity>
                </View>
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
                    renderItem={(props) => renderCartItem(props, restaurantId)}
                />
                <Text style={styles.totalPriceText}>
                    Prix : {restaurantPrice.toFixed(2)} €
                </Text>
                <CustomButton
                    text="Payer"
                    onPress={() => console.log("Panier payé pour : ", { restaurantId })}
                    backgroundColor={theme.colors.success}
                />
                <CustomButton
                    text="Supprimer tout le panier"
                    onPress={() => clearRestaurantCart(restaurantId)}
                    backgroundColor={theme.colors.danger}
                />
            </View>
        );
    };


    const handleClearCart = () => {
        Alert.alert(
            "Vider le panier",
            "Êtes-vous sûr de vouloir vider tout le panier ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Oui",
                    onPress: () => {
                        clearCart();
                    },
                    style: "destructive",
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Votre panier ({itemsNumber} articles)</Text>

            {Object.keys(cart).length > 0 ? (
                <>
                    <FlatList
                        data={Object.entries(cart)}
                        keyExtractor={(item) => item[0]}
                        renderItem={renderRestaurantCart}
                    />
                    <Text style={styles.totalPriceText}>Total : {totalPrice.toFixed(2)} €</Text>
                    <CustomButton
                        text="Vider le panier"
                        onPress={handleClearCart}
                        backgroundColor={theme.colors.danger}
                    />
                </>
            ) : (
                <View>
                    <Text style={styles.emptyCartTextTitle}>Votre panier est vide.</Text>
                    <Text style={styles.emptyCartText}>Ajouter des articles à votre panier pour les visualiser ici.</Text>
                    <CustomButton
                        text="Commander"
                        onPress={() => navigation.navigate('Tabs', {screen: "Accueil"})}
                        backgroundColor={theme.colors[6]}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default CartScreen;
