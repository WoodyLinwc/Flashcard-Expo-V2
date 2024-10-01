import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useAppState } from '../contexts/AppStateContext';

type EditCardScreenRouteProp = RouteProp<RootStackParamList, 'EditCard'>;
type EditCardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditCard'>;

const EditCardScreen: React.FC = () => {
  const route = useRoute<EditCardScreenRouteProp>();
  const navigation = useNavigation<EditCardScreenNavigationProp>();
  const { deckId, cardId } = route.params;
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const { getFlashcard, updateFlashcard, addFlashcard } = useAppState();

  useEffect(() => {
    const loadCard = async () => {
      if (cardId) {
        const card = await getFlashcard(deckId, cardId);
        if (card) {
          setFront(card.front);
          setBack(card.back);
        }
      }
    };
    loadCard();

    navigation.setOptions({ title: cardId ? 'Edit Card' : 'Add Card' });
  }, [deckId, cardId, getFlashcard, navigation]);

  const handleSave = async () => {
    if (front.trim() && back.trim()) {
      if (cardId) {
        await updateFlashcard(deckId, cardId, front.trim(), back.trim());
      } else {
        await addFlashcard(deckId, front.trim(), back.trim());
      }
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Front"
        value={front}
        onChangeText={setFront}
        style={styles.input}
      />
      <TextInput
        label="Back"
        value={back}
        onChangeText={setBack}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSave} disabled={!front.trim() || !back.trim()}>
        Save Card
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default EditCardScreen;