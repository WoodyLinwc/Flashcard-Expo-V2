import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ front, back, isFlipped }) => {
  const flipAnimation = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardText}>{front}</Text>
          </Card.Content>
        </Card>
      </Animated.View>
      <Animated.View style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle]}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardText}>{back}</Text>
          </Card.Content>
        </Card>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 200,
  },
  flipCard: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  flipCardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  card: {
    width: '100%',
    height: '100%',
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Flashcard;