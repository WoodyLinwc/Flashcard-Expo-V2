import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Button, Title, Paragraph, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useAppState } from '../contexts/AppStateContext';
import Flashcard from '../components/Flashcard';
import { PanGestureHandler, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';

type FlashcardScreenRouteProp = RouteProp<RootStackParamList, 'Flashcard'>;
type FlashcardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Flashcard'>;

const FlashcardScreen: React.FC = () => {
  const route = useRoute<FlashcardScreenRouteProp>();
  const navigation = useNavigation<FlashcardScreenNavigationProp>();
  const { deckId } = route.params;
  const { getFlashcards } = useAppState();
  const [flashcards, setFlashcards] = useState<Array<{ id: number; front: string; back: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = useCallback(() => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, flashcards.length]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const shuffleCards = useCallback(() => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  useEffect(() => {
    const loadFlashcards = async () => {
      const cards = await getFlashcards(deckId);
      setFlashcards(cards);
    };
    loadFlashcards();
  }, [deckId, getFlashcards]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="shuffle"
          onPress={shuffleCards}
        />
      ),
    });
  }, [navigation, shuffleCards]);

  const handleSwipe = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      if (translationX > 50) {
        prevCard();
      } else if (translationX < -50) {
        nextCard();
      }
    }
  };

  if (flashcards.length === 0) {
    return (
      <View style={styles.container}>
        <Title>No cards in this deck</Title>
        <Paragraph>Add some cards to start studying!</Paragraph>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('EditCard', { deckId })}
          style={styles.addCardButton}
        >
          Add Card
        </Button>
      </View>
    );
  }

  return (
    <PanGestureHandler onHandlerStateChange={handleSwipe}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handleFlip}>
          <View style={styles.flashcardContainer}>
            <Flashcard
              front={flashcards[currentIndex].front}
              back={flashcards[currentIndex].back}
              isFlipped={isFlipped}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={prevCard} disabled={currentIndex === 0}>
            Previous
          </Button>
          <Button mode="contained" onPress={nextCard} disabled={currentIndex === flashcards.length - 1}>
            Next
          </Button>
        </View>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  flashcardContainer: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  addCardButton: {
    marginTop: 20,
  },
});

export default FlashcardScreen;