import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppStateProvider } from './src/contexts/AppStateContext';
import HomeScreen from './src/screens/HomeScreen';
import DeckScreen from './src/screens/DeckScreen';
import FlashcardScreen from './src/screens/FlashcardScreen';
import CreateDeckScreen from './src/screens/CreateDeckScreen';
import EditCardScreen from './src/screens/EditCardScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <AppStateProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Decks' }} />
            <Stack.Screen name="Deck" component={DeckScreen} />
            <Stack.Screen name="Flashcard" component={FlashcardScreen} options={{ title: 'Study' }} />
            <Stack.Screen name="CreateDeck" component={CreateDeckScreen} options={{ title: 'Create Deck' }} />
            <Stack.Screen name="EditCard" component={EditCardScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppStateProvider>
    </PaperProvider>
  );
}