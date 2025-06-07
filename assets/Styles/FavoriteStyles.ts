import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    image: {
        width: 100,
        height: 100,
    },
    info: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    address: {
        fontSize: 14,
        color: '#666',
    },
    emptyText: {
        marginTop: 40,
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
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

});

export default styles;
