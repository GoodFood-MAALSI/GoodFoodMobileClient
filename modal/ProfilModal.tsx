import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../assets/Styles/AdressModalStyles';

const ProfilModal = ({ visible, onClose, onSubmit, user }: any) => {
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [streetNumber] = useState(user?.street_number || '');
    const [street] = useState(user?.street || '');
    const [city] = useState(user?.city || '');
    const [postalCode] = useState(user?.postal_code || '');
    const [country] = useState(user?.country || '');
    const [lat] = useState(user?.lat || '');
    const [long] = useState(user?.long || '');

    useEffect(() => {
        if (visible) {
            setFirstName(user?.first_name || '');
            setLastName(user?.last_name || '');
        }
    }, [visible]);

    const handleSubmit = () => {
        const updatedUser = {
            first_name: firstName,
            last_name: lastName,
            street_number: streetNumber,
            street: street,
            city: city,
            postal_code: postalCode,
            country: country,
            lat: parseFloat(lat),
            long: parseFloat(long),
        };
        onSubmit(updatedUser);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Modifier le profil</Text>

                    <TextInput
                        placeholder="Prénom"
                        value={firstName}
                        onChangeText={setFirstName}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Nom"
                        value={lastName}
                        onChangeText={setLastName}
                        style={styles.input}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Enregistrer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ProfilModal;
