import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: colors[7],
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 18,
        color: colors[8],
    },
    list: {
        paddingBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    reviewText: {
        fontSize: 16,
        color: colors[9],
        marginVertical: 8,
    },
    rating: {
        fontSize: 14,
        color: '#FFD700',
    },
    deleteButton: {
        padding: 8,
        alignSelf: 'flex-start',
    },
});

export default styles;
