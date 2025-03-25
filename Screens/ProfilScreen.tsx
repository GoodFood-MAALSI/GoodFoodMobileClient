import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../assets/Styles/ProfilStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const handleEditProfile = () => {
    console.log('Modifier les infos personnelles');
  };

  const handleAddAddress = () => {
    console.log('Ajouter une adresse');
  };

  const handleEditAddress = (id: string) => {
    console.log('Modifier adresse', id);
  };

  const handleDeleteAddress = (id: string) => {
    console.log('Supprimer adresse', id);
  };

  const handleAddPayment = () => {
    console.log('Ajouter une méthode de paiement');
  };

  const handleEditPayment = (id: string) => {
    console.log('Modifier paiement', id);
  };

  const handleDeletePayment = (id: string) => {
    console.log('Supprimer paiement', id);
  };

  const handleLogout = () => {
    console.log('Déconnexion');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Mon Profil</Text>

        {/* Infos personnelles */}
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

        {/* Adresses de livraison */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Adresses de livraison</Text>
            <TouchableOpacity onPress={handleAddAddress}>
              <Ionicons name="add-circle-outline" size={22} />
            </TouchableOpacity>
          </View>

          {[
            { id: '1', label: '12 rue des Lilas, Paris' },
            { id: '2', label: '18 avenue Jean Jaurès, Lyon' },
          ].map((address) => (
            <View key={address.id} style={styles.row}>
              <Text style={styles.value}>🏠 {address.label}</Text>
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Méthodes de paiement</Text>
            <TouchableOpacity onPress={handleAddPayment}>
              <Ionicons name="add-circle-outline" size={22} />
            </TouchableOpacity>
          </View>

          {[
            { id: '1', label: 'Visa •••• 1234' },
            { id: '2', label: 'MasterCard •••• 5678' },
          ].map((payment) => (
            <View key={payment.id} style={styles.row}>
              <Text style={styles.value}>💳 {payment.label}</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => handleEditPayment(payment.id)}>
                  <Ionicons name="create-outline" size={18} style={styles.iconSpacing} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePayment(payment.id)}>
                  <Ionicons name="trash-outline" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
