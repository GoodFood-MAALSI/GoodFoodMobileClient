import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../assets/Styles/ProfilStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../Context/UserContext';
import useUserAddresses from '../hooks/profil/useAdresses';
import AddressModal from '../modal/AdressModal';

export default function ProfileScreen({ navigation }: any) {
  const { logout } = useUser();
  const { addresses, addAddress, updateAddress, deleteAddress } = useUserAddresses();
  const [modalVisible, setModalVisible] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<any>(null);

  const handleEditProfile = () => {
    console.log('Modifier les infos personnelles');
  };

  const handleAddAddress = () => {
    setAddressToEdit(null);
    setModalVisible(true);
  };

  const handleEditAddress = (id: string) => {
    const address = addresses.find((address) => address.id === id);
    if (address) {
      setAddressToEdit(address);
      setModalVisible(true);
    }
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddress(id);
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  const handleModalSubmit = (addressData: any) => {
    if (addressToEdit) {
      updateAddress(addressToEdit.id, addressData);
    } else {
      addAddress(addressData);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Mon Profil</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Nom</Text>
              <Text style={styles.value}>Maxence Crespel</Text>
            </View>
            <TouchableOpacity onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>maxence@example.com</Text>
            </View>
            <TouchableOpacity onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Adresses de livraison</Text>
            <TouchableOpacity onPress={handleAddAddress}>
              <Ionicons name="add-circle-outline" size={22} />
            </TouchableOpacity>
          </View>

          {addresses.map((address) => (
            <View key={address.id} style={styles.row}>
              <Text style={styles.value}>🏠 {address.street_number} {address.street}, {address.city}</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => handleEditAddress(address.id)}>
                  <Ionicons name="create-outline" size={18} style={styles.iconSpacing} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAddress(address.id)}>
                  <Ionicons name="trash-outline" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>

      <AddressModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        addressToEdit={addressToEdit}
      />
    </SafeAreaView>
  );
}
