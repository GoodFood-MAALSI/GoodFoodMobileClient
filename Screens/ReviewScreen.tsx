import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import useReview from '../hooks/restaurants/UseReview';
import styles from '../assets/Styles/ReviewStyles';

const ReviewScreen = ({ navigation }: any) => {
  const { reviews, getReviews, deleteReview, isLoading, error } = useReview();

  useEffect(() => {
    getReviews();
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Vos avis</Text>
      </View>
      {reviews.length === 0 ? (
        <Text style={styles.emptyText}>Aucun avis</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.restaurant_image }}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{item.restaurant_name}</Text>
                <Text style={styles.reviewText}>{item.review}</Text>
                <Text style={styles.rating}>⭐ {item.rating} / 5</Text>
              </View>
              <TouchableOpacity onPress={() => deleteReview(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default ReviewScreen;
