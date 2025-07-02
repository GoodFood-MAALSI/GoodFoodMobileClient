import { StyleSheet } from 'react-native';

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
        marginTop: 50,
        color: '#333',
        textAlign: 'center',
    },
    restaurantCardContainer: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#F8F8F8',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        marginHorizontal: 10,
    },
    topPartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    restaurantImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 15,
    },
    restaurantInfo: {
        flex: 1,
    },
    restaurantTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    restaurantDetails: {
        fontSize: 16,
        color: '#666',
    },
    bottomPartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        marginRight: 10,
    },
    removeButton: {
        flex: 0.2,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        fontSize: 30,
        color: '#FF6B6B',
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
});

export default styles;
