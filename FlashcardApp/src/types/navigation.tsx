import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Deck: { deckId: number };
  Flashcard: { deckId: number; flashcardId?: number };
  CreateDeck: undefined;
  EditCard: { deckId: number; cardId?: number };
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type DeckScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Deck'>;
export type FlashcardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Flashcard'>;
export type CreateDeckScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateDeck'>;
export type EditCardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditCard'>;

export type DeckScreenRouteProp = RouteProp<RootStackParamList, 'Deck'>;
export type FlashcardScreenRouteProp = RouteProp<RootStackParamList, 'Flashcard'>;
export type EditCardScreenRouteProp = RouteProp<RootStackParamList, 'EditCard'>;