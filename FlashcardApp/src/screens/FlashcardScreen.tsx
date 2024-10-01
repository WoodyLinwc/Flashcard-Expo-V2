import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useAppState } from '../contexts/AppStateContext';

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

  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const loadFlashcards = async () => {
      const cards = await getFlashcards(deckId);
      setFlashcards(cards);
    };
    loadFlashcards();
  }, [deckId, getFlashcards]);

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      animatedValue.setValue(0);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      animatedValue.setValue(0);
    }
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
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
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={flipCard}>
        <View>
          <Animated.View style={[styles.flashcard, frontAnimatedStyle]}>
            <Card>
              <Card.Content>
                <Title>Front</Title>
                <Paragraph>{flashcards[currentIndex].front}</Paragraph>
              </Card.Content>
            </Card>
          </Animated.View>
          <Animated.View style={[styles.flashcard, styles.flashcardBack, backAnimatedStyle]}>
            <Card>
              <Card.Content>
                <Title>Back</Title>
                <Paragraph>{flashcards[currentIndex].back}</Paragraph>
              </Card.Content>
            </Card>
          </Animated.View>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  flashcard: {
    width: 300,
    height: 200,
    backfaceVisibility: 'hidden',
  },
  flashcardBack: {
    position: 'absolute',
    top: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  addCardButton: {
    marginTop: 20,
  },
});

export default FlashcardScreen;