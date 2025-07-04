import { StyleSheet } from 'react-native';
import theme from './themes';
import colors from './colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    title: {
        marginTop: theme.spacing.md,
        fontSize: theme.spacing.fontSize.xl,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
        color: theme.colors.text,
    },
    description: {
        marginTop: 4,
        fontSize: theme.spacing.fontSize.sm,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
        color: '#666',
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
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    checkbox: {
        width: 12,
        height: 12,
        marginRight: 5,
    },
    filterText: {
        fontSize: theme.spacing.fontSize.md,
    },
    restaurantImage: {
        width: '100%',
        height: 200,
        marginBottom: 15,
    },
    menuCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: theme.spacing.borderRadius.md,
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    menuImage: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    menuInfo: {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
    },
    menuName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    menuDescription: {
        fontSize: 14,
        color: '#666',
    },
    menuPrice: {
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
    backButton: {
        padding: 10,
        marginRight: 10,
    },
    reviewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 8,
    },
    reviewText: {
        fontSize: 14,
        color: '#333',
    },
    addReviewLink: {
        color: colors[10],
        fontSize: 14,
        fontWeight: '600',
    },
    restaurantAddress: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default styles;
