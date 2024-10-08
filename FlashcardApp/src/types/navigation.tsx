import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// RootStackParamList: This defines the structure of your navigation stack. 
// It lists all the screens in your app and the parameters they can receive.
export type RootStackParamList = {
  Home: undefined;
  Deck: { deckId: number };
  Flashcard: { deckId: number; flashcardId?: number };
  CreateDeck: undefined;
  EditCard: { deckId: number; cardId?: number };
};

// This ensures that you're using the correct navigation methods and passing the right parameters when navigating.
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type DeckScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Deck'>;
export type FlashcardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Flashcard'>;
export type CreateDeckScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateDeck'>;
export type EditCardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditCard'>;

// This is useful for accessing parameters passed to the screen.
export type DeckScreenRouteProp = RouteProp<RootStackParamList, 'Deck'>;
export type FlashcardScreenRouteProp = RouteProp<RootStackParamList, 'Flashcard'>;
export type EditCardScreenRouteProp = RouteProp<RootStackParamList, 'EditCard'>;