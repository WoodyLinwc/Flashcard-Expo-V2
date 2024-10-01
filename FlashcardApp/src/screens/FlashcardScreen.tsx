import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { FlashcardScreenNavigationProp, FlashcardScreenRouteProp } from '../types/navigation';
import { useAppState } from '../contexts/AppStateContext';

type Props = {
  navigation: FlashcardScreenNavigationProp;
  route: FlashcardScreenRouteProp;
};

const FlashcardScreen: React.FC<Props> = ({ route }) => {
  const { deckId, flashcardId } = route.params;
  const { getFlashcard } = useAppState();
  const [flashcard, setFlashcard] = useState<{ front: string; back: string } | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Animation value for card flip
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const loadFlashcard = async () => {
      const card = await getFlashcard(deckId, flashcardId);
      if (card) {
        setFlashcard({ front: card.front, back: card.back });
      }
    };
    loadFlashcard();
  }, [deckId, flashcardId, getFlashcard]);

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

  if (!flashcard) {
    return <View style={styles.container}><Title>Loading...</Title></View>;
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={flipCard}>
        <View>
          <Animated.View style={[styles.flashcard, frontAnimatedStyle]}>
            <Card>
              <Card.Content>
                <Title>Front</Title>
                <Paragraph>{flashcard.front}</Paragraph>
              </Card.Content>
            </Card>
          </Animated.View>
          <Animated.View style={[styles.flashcard, styles.flashcardBack, backAnimatedStyle]}>
            <Card>
              <Card.Content>
                <Title>Back</Title>
                <Paragraph>{flashcard.back}</Paragraph>
              </Card.Content>
            </Card>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      <Button mode="contained" onPress={flipCard} style={styles.flipButton}>
        Flip Card
      </Button>
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
  flipButton: {
    marginTop: 20,
  },
});

export default FlashcardScreen;