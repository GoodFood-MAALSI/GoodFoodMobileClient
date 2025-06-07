import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        width: '80%',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        backgroundColor: colors.primary || '#4CAF50',
        padding: 10,
        borderRadius: 8,
        width: '48%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#E53935',
        padding: 10,
        borderRadius: 8,
        width: '48%',
    },
    cancelButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
    },
    mapButton: {
        backgroundColor: '#e0e0e0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    mapButtonText: {
        textAlign: 'center',
        fontSize: 16,
    }

});

export default styles;
