import { StyleSheet } from 'react-native';
import theme from './themes';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    itemContainer: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#F8F8F8',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        gap: 30
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemPrice: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
        marginTop: 5,
    },
    extrasContainer: {
        marginTop: 5,
        paddingLeft: 15,
    },
    extraPrice: {
        fontSize: 14,
        color: '#999',
        marginTop: 3,
        fontStyle: 'italic',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        fontSize: 20,
        paddingHorizontal: 10,
        backgroundColor: theme.colors.primary,
        color: '#FFF',
        borderRadius: 8,
    },
    quantity: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    removeButton: {
        marginTop: 10,
        padding: 8,
    },
    removeButtonText: {
        fontSize: 24,
        color: '#FF6B6B',
    },
    footerContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    orderButton: {
        marginTop: 15,
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: theme.colors.success,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    restaurantImage: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    menuImage: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
});

export default styles;
