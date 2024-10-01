import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useAppState } from '../contexts/AppStateContext';

type Flashcard = {
  id: number;
  front: string;
  back: string;
};

const FlashcardScreen = () => {
  const route = useRoute();
  const { flashcardId, deckId } = route.params as { flashcardId: number; deckId: number };
  const { getFlashcard } = useAppState();
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const loadFlashcard = async () => {
      const card = await getFlashcard(deckId, flashcardId);
      setFlashcard(card);
    };
    loadFlashcard();
  }, [flashcardId, deckId]);

  if (!flashcard) {
    return <View><Title>Loading...</Title></View>;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{isFlipped ? 'Back' : 'Front'}</Title>
          <Paragraph>{isFlipped ? flashcard.back : flashcard.front}</Paragraph>
        </Card.Content>
      </Card>
      <Button mode="contained" onPress={() => setIsFlipped(!isFlipped)}>
        Flip Card
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
});

export default FlashcardScreen;