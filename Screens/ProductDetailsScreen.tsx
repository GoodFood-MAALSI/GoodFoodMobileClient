import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../Context/CartContext';
import CustomButton from '../Components/CustomButton';
import theme from '../assets/Styles/themes';
import styles from '../assets/Styles/ProductDetailsStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetailsScreen = ({ route, navigation }: any) => {
    const { product, restaurant } = route.params;
    const [address, setAddress] = useState('Chargement de votre adresse...');
    const [quantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<{ [optionId: number]: number[] }>({});
    const { addItemToCart, getItemsNumber } = useCart();
    const itemsNumber = getItemsNumber();

    useEffect(() => {
        const loadAddress = async () => {
            try {
                const storedAddress = await AsyncStorage.getItem('address') || '';
                const addressParts = storedAddress.split(',');
                const formattedAddress = `${addressParts[0]}, ${addressParts[1]}`.trim();
                setAddress(formattedAddress);
            } catch (error) {
                console.error('Erreur lors du chargement de l\'adresse :', error);
            }
        };

        loadAddress();
    }, []);

    const toggleOption = (optionId: number, valueId: number, isMultiple: boolean) => {
        setSelectedOptions(prev => {
            const current = prev[optionId] || [];
            if (isMultiple) {
                return {
                    ...prev,
                    [optionId]: current.includes(valueId)
                        ? current.filter(id => id !== valueId)
                        : [...current, valueId],
                };
            } else {
                return {
                    ...prev,
                    [optionId]: current.includes(valueId) ? [] : [valueId],
                };
            }

        });
    };

    const validateSelections = () => {
        for (const option of product.menuItemOptions || []) {
            if (option.is_required && (!selectedOptions[option.id] || selectedOptions[option.id].length === 0)) {
                Alert.alert('Erreur', `Veuillez sélectionner une option pour : ${option.name}`);
                return false;
            }
        }
        return true;
    };

    const calculateTotalPrice = () => {
        let extra = 0;
        for (const option of product.menuItemOptions || []) {
            const selected = selectedOptions[option.id] || [];
            for (const val of option.menuItemOptionValues) {
                if (selected.includes(val.id)) {
                    extra += parseFloat(val.extra_price);
                }
            }
        }
        return (parseFloat(product.price) + extra) * quantity;
    };


    const handleAddToCart = () => {
        if (!validateSelections()) return;

        for (let i = 0; i < quantity; i++) {
            addItemToCart(
                {
                    ...product,
                    selectedOptions,
                },
                restaurant?.name,
                restaurant?.id,
                restaurant?.images
            );
        }
        Alert.alert('Produit ajouté', `${quantity} x ${product.name} ajouté(s) au panier.`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.address}>{address}</Text>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Tabs', { screen: 'Panier' })}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="cart-outline" size={24} color="black" />
                            {itemsNumber > 0 && (
                                <View style={styles.badgeContainer}>
                                    <Text style={styles.badgeText}>{itemsNumber}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.subcontainer} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_RESTAURANT_API + product.images[0].path }} style={styles.productImage} />
                <Text style={styles.title}>{product.name}</Text>
                <Text style={styles.price}>{calculateTotalPrice().toFixed(2)} €</Text>
                <Text style={styles.description}>{product.description}</Text>
                {product.menuItemOptions?.map((option: any) => (
                    <View key={option.id} style={styles.optionContainer}>
                        <View style={styles.optionHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>{option.name}</Text>
                                <Text style={styles.optionDescription}>
                                    {option.is_multiple_choice ? 'Choix multiples possibles' : 'Choisissez-en 1'}
                                </Text>
                            </View>
                            {option.is_required && <Text style={styles.optionRequired}>Obligatoire</Text>}
                        </View>
                        {option.menuItemOptionValues
                            .sort((a: any, b: any) => a.position - b.position)
                            .map((val: any) => {
                                const isSelected = selectedOptions[option.id]?.includes(val.id);
                                return (
                                    <TouchableOpacity
                                        key={val.id}
                                        style={styles.optionItem}
                                        onPress={() => toggleOption(option.id, val.id, option.is_multiple_choice)}
                                    >
                                        <View style={styles.checkboxContainer}>
                                            <Checkbox
                                                value={isSelected}
                                                onValueChange={() => toggleOption(option.id, val.id, option.is_multiple_choice)}
                                                style={styles.checkbox}
                                            />
                                            <Text>
                                                {val.name}
                                                {parseFloat(val.extra_price) > 0 && ` (+${val.extra_price} €)`}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                    </View>
                ))}
                <CustomButton
                    text={`Ajouter au panier`}
                    onPress={handleAddToCart}
                    backgroundColor={theme.colors.success}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProductDetailsScreen;
