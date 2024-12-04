import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, FAB, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useAppState } from '../contexts/AppStateContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { decks } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

    const filteredDecks = useMemo(() => {
    return decks.filter(deck => 
      deck.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [decks, searchQuery]);


  const handleDeckPress = (deckId: number) => {
    navigation.navigate('Deck', { deckId });
  };

  const handleAddDeck = () => {
    navigation.navigate('CreateDeck');
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search decks"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      {filteredDecks.map((deck) => (
        <List.Item
          key={deck.id}
          title={deck.name}
          description={`${deck.cardCount} cards`}
          onPress={() => handleDeckPress(deck.id)}
          right={() => <List.Icon icon="chevron-right" />}
        />
      ))}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddDeck}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;