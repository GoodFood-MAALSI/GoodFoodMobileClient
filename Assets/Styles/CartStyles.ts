import { StyleSheet } from 'react-native';
import theme from './themes';

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
        textAlign: 'center',
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
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    quantityButton: {
        padding: 5,
        backgroundColor: theme.colors.primary,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 5,
        borderRadius: 5,
    },
    removeButton: {
        padding: 5,
        color: theme.colors.danger,
        fontSize: 18,
        marginLeft: 10,
    },
});

export default styles;
