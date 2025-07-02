import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../Context/CartContext';
import useRestaurantDetails from '../hooks/restaurants/UseRestaurantDetails';
import CustomTabs from '../Components/CustomTabs';
import styles from '../assets/Styles/MenuStyles';
import ReviewModal from '../modal/ReviewModal';
import useReview from '../hooks/restaurants/UseReview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RestaurantMenuScreen = ({ route, navigation }: any) => {
  const { restaurant } = route.params;
  const [address, setAddress] = useState('Chargement de votre adresse...');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const { data: restaurantData, isLoading } = useRestaurantDetails(restaurant.id);
  const { getItemsNumber } = useCart();
  const itemsNumber = getItemsNumber();

  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const { addReview } = useReview();

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

  if (isLoading || !restaurantData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const categories = restaurantData.menuCategories.map((cat: any) => ({
    key: String(cat.id),
    label: cat.name,
  }));

  const filteredItems = restaurantData.menuCategories
    .filter((cat: any) => !selectedCategoryId || cat.id === selectedCategoryId)
    .flatMap((cat: any) => cat.menuItems);

  const handleAddReview = () => {
    setReviewModalVisible(true);
  };

  const handleReviewSubmit = (review: any) => {
    addReview(review, restaurantData.id);
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
      <Text style={styles.title}>{restaurant.name}</Text>
      <Text style={styles.restaurantAddress}>
        {restaurant.street_number} {restaurant.street}, {restaurant.city}
      </Text>
      <Text style={styles.description}>{restaurant.description}</Text>
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewText}>
          ⭐ {restaurantData.average_rating?.toFixed(1) || '–'} / 5 ({restaurantData?.review_count || 0} avis)
        </Text>
        <TouchableOpacity onPress={handleAddReview}>
          <Text style={styles.addReviewLink}>Ajouter un avis</Text>
        </TouchableOpacity>
      </View>

      <CustomTabs
        tabs={[{ key: 'all', label: 'Tout' }, ...categories]}
        activeTab={selectedCategoryId?.toString() || 'all'}
        onTabChange={(key: string) => setSelectedCategoryId(key === 'all' ? null : parseInt(key))}
      />
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('ProductDetails', { product: item, restaurant: restaurantData })}
          >
            <Image source={{ uri: item.picture }} style={styles.menuImage} />
            <View style={styles.menuInfo}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
              <Text style={styles.menuPrice}>{item.price} €</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <ReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleReviewSubmit}
      />

    </SafeAreaView>
  );
};

export default RestaurantMenuScreen;
