import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    orderDetailsContainer: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: colors.primary,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
        color: colors.primary,
    },
    total: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.success,
        marginVertical: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        flex: 1,
    },
    itemQuantity: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.secondary,
        marginRight: 10,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.success,
    },
    noItemsText: {
        fontSize: 16,
        color: colors.text,
        fontStyle: 'italic',
        marginTop: 10,
    },
    backButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: colors.primary,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        color: colors.primary,
        fontWeight: '500',
    },
    errorText: {
        fontSize: 18,
        textAlign: 'center',
        color: colors.danger,
        fontWeight: '500',
    },
});

export default styles;
