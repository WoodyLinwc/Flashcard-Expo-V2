import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStateProvider } from './src/contexts/AppStateContext';
import HomeScreen from './src/screens/HomeScreen';
import DeckScreen from './src/screens/DeckScreen';
import FlashcardScreen from './src/screens/FlashcardScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AppStateProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'My Decks' }} />
          <Stack.Screen name="Deck" component={DeckScreen} options={{ title: 'Flashcards' }} />
          <Stack.Screen name="Flashcard" component={FlashcardScreen} options={{ title: 'Study' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppStateProvider>
  );
}