import { StyleSheet } from 'react-native';
import theme from './themes';

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: '#00000066',
        justifyContent: 'center',
        alignItems: 'center',
        // margin: theme.spacing.sm,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '85%',
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    star: {
        marginHorizontal: 4,
    },
    textArea: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical: 'top',
        padding: 10,
        marginBottom: 16,
        color: '#000',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: theme.spacing.md,
    },
    submitButton: {
        backgroundColor: '#28A745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    cancelButtonText: {
        color: '#555',
        fontWeight: '600',
    },
});

export default styles;
