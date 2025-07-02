import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useUser } from '../Context/UserContext';
import useOrder from '../hooks/order/UseOrder';
import styles from '../assets/Styles/OrderDetailsStyles';

export default function OrderDetailsScreen({ route, navigation }: any) {
    const { orderId } = route.params;
    const { user } = useUser();
    const { getOrderById, order, isLoading, error } = useOrder();

    useEffect(() => {
        if (user && user.id && orderId) {
            getOrderById(orderId);
        }
    }, [user, orderId]);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.loadingText}>Chargement des détails de la commande...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Une erreur est survenue: {error}</Text>
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Commande non trouvée</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.orderDetailsContainer}>
                    <Text style={styles.title}>Détails de la commande #{order.id}</Text>
                    <Text style={styles.label}>Date de commande: {new Date(order.created_at).toLocaleDateString()}</Text>
                    <Text style={styles.label}>Statut: {order.status?.name}</Text>
                    <Text style={styles.total}>Total: {(parseFloat(order.subtotal) + parseFloat(order.delivery_costs) + parseFloat(order.service_charge)).toFixed(2)} €</Text>

                    <Text style={styles.sectionTitle}>Articles commandés:</Text>
                    {order.orderItems && order.orderItems.length > 0 ? (
                        order.orderItems.map((item: any) => (
                            <View key={item.menu_item_id} style={styles.row}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                <Text style={styles.itemPrice}>{item.unit_price} €</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noItemsText}>Aucun article dans cette commande.</Text>
                    )}

                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Retour</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
