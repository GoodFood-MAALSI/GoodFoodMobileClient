import { StyleSheet } from 'react-native';
import theme from './themes';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    subcontainer: {
        paddingBottom: 40,
        alignItems: 'center',
        paddingHorizontal: 20,
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
    productImage: {
        width: 250,
        height: 250,
        borderRadius: theme.spacing.borderRadius.md,
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    title: {
        fontSize: theme.spacing.fontSize.xl,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
    },
    price: {
        fontSize: theme.spacing.fontSize.lg,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
    },
    description: {
        fontSize: theme.spacing.fontSize.md,
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.spacing.fontSize.md,
        fontWeight: 'bold',
        marginTop: theme.spacing.md,
    },
    calories: {
        fontSize: theme.spacing.fontSize.md,
        color: '#FF5733',
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
    },
    ingredientItem: {
        fontSize: theme.spacing.fontSize.md,
        textAlign: 'center',
        marginVertical: 2,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    quantityButton: {
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    quantityButtonText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: theme.spacing.fontSize.md,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    backButton: {
        padding: 10,
        marginRight: 10,
    },
        optionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 12,
        color: '#888',
    },
    optionRequired: {
        fontSize: 12,
        color: '#d9534f',
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 10,
    },
    optionContainer: {
        marginTop: 20,
        width: '90%',
    },
    optionItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
    },
});

export default styles;
