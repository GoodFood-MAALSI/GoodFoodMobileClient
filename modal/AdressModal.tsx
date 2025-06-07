import React, { useState, useEffect } from 'react';
import { Modal, Text, TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../assets/Styles/AdressModalStyles';

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (addressData: any) => void;
  addressToEdit?: any;
}

const AddressModal: React.FC<AddressModalProps> = ({ visible, onClose, onSubmit, addressToEdit }) => {
  const [streetNumber, setStreetNumber] = useState(addressToEdit?.street_number || '');
  const [street, setStreet] = useState(addressToEdit?.street || '');
  const [city, setCity] = useState(addressToEdit?.city || '');
  const [postalCode, setPostalCode] = useState(addressToEdit?.postal_code || '');
  const [country, setCountry] = useState(addressToEdit?.country || '');
  const [isDefault, setIsDefault] = useState(addressToEdit?.is_default || false);
  const [showMap, setShowMap] = useState(false);
  const [markerCoords, setMarkerCoords] = useState<{ latitude: number, longitude: number } | null>(null);

  useEffect(() => {
    if (addressToEdit) {
      setStreetNumber(addressToEdit.street_number);
      setStreet(addressToEdit.street);
      setCity(addressToEdit.city);
      setPostalCode(addressToEdit.postal_code);
      setCountry(addressToEdit.country);
      setIsDefault(addressToEdit.is_default);
    }
  }, [addressToEdit]);

  const handleSubmit = () => {
    const addressData = {
      street_number: streetNumber,
      street,
      city,
      postal_code: postalCode,
      country,
      is_default: isDefault,
    };
    onSubmit(addressData);
    onClose();
  };

  return (
    <>
      <Modal visible={visible && !showMap} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {addressToEdit ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
            </Text>

            <TouchableOpacity onPress={() => setShowMap(true)} style={styles.mapButton}>
              <Text style={styles.mapButtonText}>📍 Choisir sur la carte</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Numéro de rue"
              placeholderTextColor="#B0B0B0"
              value={streetNumber}
              onChangeText={setStreetNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Rue"
              placeholderTextColor="#B0B0B0"
              value={street}
              onChangeText={setStreet}
            />
            <TextInput
              style={styles.input}
              placeholder="Ville"
              placeholderTextColor="#B0B0B0"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={styles.input}
              placeholder="Code postal"
              placeholderTextColor="#B0B0B0"
              value={postalCode}
              onChangeText={setPostalCode}
            />
            <TextInput
              style={styles.input}
              placeholder="Pays"
              placeholderTextColor="#B0B0B0"
              value={country}
              onChangeText={setCountry}
            />

            <View style={styles.row}>
              <Text>Adresse par défaut</Text>
              <TouchableOpacity onPress={() => setIsDefault(!isDefault)}>
                <Text>{isDefault ? 'Oui' : 'Non'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>
                  {addressToEdit ? 'Mettre à jour' : 'Ajouter'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showMap} animationType="slide">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 48.8566,
            longitude: 2.3522,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={async (e) => {
            const coords = e.nativeEvent.coordinate;
            setMarkerCoords(coords);

            try {
              const reverse = await Location.reverseGeocodeAsync(coords);
              const first = reverse[0];
              if (first) {
                setStreetNumber(first?.streetNumber || '');
                setStreet(first?.street || '');
                setCity(first?.city || '');
                setPostalCode(first?.postalCode || '');
                setCountry(first?.country || '');
              }
              setShowMap(false);
            } catch (error) {
              console.error('Erreur reverse geocode:', error);
              setShowMap(false);
            }
          }}
        >
          {markerCoords && <Marker coordinate={markerCoords} />}
        </MapView>
      </Modal>
    </>
  );
};

export default AddressModal;
