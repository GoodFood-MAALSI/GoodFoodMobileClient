import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../assets/Styles/FavoriteStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

const FavoriteScreen = ({ navigation }: any) => {
    const [favorites, setFavorites] = useState<any[]>([]);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const stored = await AsyncStorage.getItem('favoriteRestaurants');
                if (stored) {
                    setFavorites(JSON.parse(stored));
                }
            } catch (e) {
                console.error('Erreur chargement favoris:', e);
            }
        };
        loadFavorites();
    }, []);

    if (favorites.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.emptyText}>Aucun restaurant favori</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Vos favoris</Text>
            </View>

            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={item.image} style={styles.image} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.address}>{item.street_number} {item.street}, {item.city}</Text>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>

    );
};

export default FavoriteScreen;
