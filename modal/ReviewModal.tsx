import React, { useState } from 'react';
import {
  Modal,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../assets/Styles/ReviewModalStyles';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; review: string }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleStarPress = (value: number) => setRating(value);

  const handleSubmit = () => {
    if (!rating || !review.trim()) return;
    onSubmit({ rating, review });
    setRating(0);
    setReview('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackground}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <Text style={styles.title}>Laisser un avis</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
                  <Ionicons
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={28}
                    color="#FFD700"
                    style={styles.star}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Votre commentaire"
              placeholderTextColor="#999"
              style={styles.textArea}
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
              blurOnSubmit={true}
            />

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Envoyer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReviewModal;
