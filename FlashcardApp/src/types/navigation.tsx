import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Deck: { deckId: number };
  Flashcard: { flashcardId: number; deckId: number };
};

export type HomeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

export type DeckScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Deck'>;
export type DeckScreenRouteProp = RouteProp<RootStackParamList, 'Deck'>;

export type FlashcardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Flashcard'>;
export type FlashcardScreenRouteProp = RouteProp<RootStackParamList, 'Flashcard'>;

// Add more screen-specific types as needed