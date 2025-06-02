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
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    favoriteToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 10,
        justifyContent: 'center',
    },
    favoriteToggleText: {
        marginLeft: 10,
        fontSize: 16,
        color: 'grey',
    },
    distanceFilterContainer: {
        padding: 20,
        alignItems: 'center',
    },
    selectedAddressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        margin: 10,
    },

    selectedAddressText: {
        flex: 1,
        marginHorizontal: 10,
        fontSize: 16,
        color: '#000',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        maxHeight: 300,
    },

    addressItem: {
        padding: 15,
    },

    addressItemText: {
        fontSize: 16,
        color: '#333',
    },

    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginHorizontal: 10,
    },

});

export default styles;
