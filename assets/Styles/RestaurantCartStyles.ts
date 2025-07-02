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
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#F8F8F8',
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    itemPrice: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
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
        marginLeft: 10,
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
});

export default styles;
