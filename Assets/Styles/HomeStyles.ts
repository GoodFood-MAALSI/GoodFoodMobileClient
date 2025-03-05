import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F5F5F5',
    },
    address: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    iconsContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    searchContainer: {
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    restaurantList: {
        padding: 15,
    },
    restaurantCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    restaurantImage: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    restaurantInfo: {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    restaurantAddress: {
        fontSize: 14,
        color: '#666',
    },
    iconContainer: {
        position: 'relative',
    },
    badgeContainer: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default styles;
