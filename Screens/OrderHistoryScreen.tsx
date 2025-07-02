import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useUser } from '../Context/UserContext';
import useOrder from '../hooks/order/UseOrder';
import styles from '../assets/Styles/OrderHistoryStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderHistoryScreen = ({ navigation }: any) => {
    const { user } = useUser();
    const { getOrdersByClientId, orders, isLoading, error } = useOrder();

    useEffect(() => {
        if (orders.length === 0 && user?.id) {
            getOrdersByClientId(user.id);
        }
    }, [orders, user?.id]);

    const renderOrderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.orderItem}
              onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
        >
            <Text style={styles.orderTitle}>Commande #{item.id}</Text>
            <Text style={styles.orderDetails}>Date: {new Date(item.created_at).toLocaleDateString()}</Text>
            <Text style={styles.orderDetails}>Status: {item.status?.name || 'Inconnu'}</Text>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Chargement des commandes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Erreur: {error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Historique des commandes</Text>
            {orders.length === 0 ? (
                <Text style={styles.noOrdersText}>Aucune commande trouvée.</Text>
            ) : (
                <FlatList
                  data={orders}
                  renderItem={renderOrderItem}
                  keyExtractor={(item) => item.id.toString()}
                />
            )}
        </SafeAreaView>
    );
};

export default OrderHistoryScreen;
