import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from '../Assets/Styles/ForgotPasswordStyles';

export default function ForgotPasswordScreen({ navigation }: any) {
    const [email, setEmail] = useState('');

    const handlePasswordReset = () => {
        alert(`Un lien de réinitialisation a été envoyé à ${email}.`);
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text style={styles.subtitle}>
                Entrez votre adresse mail pour recevoir un lien de réinitialisation.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Adresse Mail"
                placeholderTextColor="#B0B0B0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Envoyer le lien</Text>
            </TouchableOpacity>
        </View>
    );
}
