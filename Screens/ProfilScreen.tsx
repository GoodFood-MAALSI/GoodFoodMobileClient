import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../assets/Styles/ProfilStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../Context/UserContext';
import useUserAddresses from '../hooks/profil/UseAdresses';
import AddressModal from '../modal/AdressModal';
import useUserProfil from '../hooks/profil/UseProfil';
import ProfilModal from '../modal/ProfilModal';
import colors from '../assets/Styles/colors';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useUser();
  const { addresses, addAddress, updateAddress, deleteAddress } = useUserAddresses();
  const [modalVisible, setModalVisible] = useState(false);
  const [profilModalVisible, setProfilModalVisible] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<any>(null);
  const { isLoading, error, updateProfil } = useUserProfil();

  const handleEditProfil = () => {
    setProfilModalVisible(true);
  };

  const handleProfilSubmit = async (profilData: any) => {
    const success = await updateProfil(profilData);
    if (success) {
      setProfilModalVisible(false);
    } else {
      console.error("erreur mise à jour prénom et nom")
    }
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
        <Text style={styles.title}>{user?.first_name} {user?.last_name}</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('Favoris')}
          >
            <Ionicons name="heart-outline" size={28} color={colors[7]} />
            <Text style={styles.quickCardTitle}>Favoris</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => console.log("navigation vers mes commandes")}
          >
            <Ionicons name="receipt-outline" size={28} color={colors[7]} />
            <Text style={styles.quickCardTitle}>Commandes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Nom</Text>
              <Text style={styles.value}>{user?.first_name} {user?.last_name}</Text>
            </View>
            <TouchableOpacity onPress={handleEditProfil}>
              <Ionicons name="create-outline" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Adresses de livraison</Text>
            <TouchableOpacity onPress={handleAddAddress}>
              <Ionicons name="add-circle-outline" size={25} />
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
          <Ionicons name="log-out-outline" size={20} color="#E53935" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>

      <AddressModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        addressToEdit={addressToEdit}
      />
      <ProfilModal
        visible={profilModalVisible}
        onClose={() => setProfilModalVisible(false)}
        onSubmit={handleProfilSubmit}
        user={user}
      />

    </SafeAreaView>
  );
}
