import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, FAB, Menu, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useAppState } from '../contexts/AppStateContext';
import SearchBarComponent from '../components/SearchBar';
import ImportExportMenu from '../components/ImportExport';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { decks, exportDecks, importDecks } = useAppState();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDecks = useMemo(() => {
    return decks.filter(deck => 
      deck.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [decks, searchQuery]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={isMenuVisible}
          onDismiss={() => setIsMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setIsMenuVisible(true)}
            />
          }
        >
          <ImportExportMenu 
            isVisible={isMenuVisible}
            onDismiss={() => setIsMenuVisible(false)}
            onExport={exportDecks}
            onImport={importDecks}
          />
        </Menu>
      ),
    });
  }, [navigation, isMenuVisible, exportDecks, importDecks]);

  const handleDeckPress = (deckId: number) => {
    navigation.navigate('Deck', { deckId });
  };

  const handleAddDeck = () => {
    navigation.navigate('CreateDeck');
  };

  return (
    <View style={styles.container}>
      <SearchBarComponent
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search decks"
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;