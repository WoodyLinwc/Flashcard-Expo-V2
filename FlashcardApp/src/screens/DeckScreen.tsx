import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, FAB, Button, Title, IconButton, Dialog, Portal, Paragraph } from 'react-native-paper';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useAppState } from '../contexts/AppStateContext';

type DeckScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Deck'>;
type DeckScreenRouteProp = RouteProp<RootStackParamList, 'Deck'>;

type Flashcard = {
  id: number;
  front: string;
  back: string;
};

const DeckScreen: React.FC = () => {
  const navigation = useNavigation<DeckScreenNavigationProp>();
  const route = useRoute<DeckScreenRouteProp>();
  const { deckId } = route.params;
  const { getFlashcards, getDeck, deleteDeck } = useAppState();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [deckName, setDeckName] = useState('');
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const loadDeckAndFlashcards = useCallback(async () => {
    const deck = await getDeck(deckId);
    if (deck) {
      setDeckName(deck.name);
      navigation.setOptions({
        title: deck.name,
        headerRight: () => (
          <IconButton
            icon="delete"
            onPress={() => setIsDeleteDialogVisible(true)}
          />
        ),
      });
    }
    const cards = await getFlashcards(deckId);
    setFlashcards(cards);
  }, [deckId, getDeck, getFlashcards, navigation]);

  useEffect(() => {
    loadDeckAndFlashcards();
  }, [loadDeckAndFlashcards]);

  useFocusEffect(
    useCallback(() => {
      loadDeckAndFlashcards();
    }, [loadDeckAndFlashcards])
  );

  const handleDeleteDeck = async () => {
    await deleteDeck(deckId);
    navigation.goBack();
  };

  const renderFlashcardItem = ({ item }: { item: Flashcard }) => (
    <List.Item
      title={item.front}
      onPress={() => navigation.navigate('EditCard', { deckId, cardId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{deckName}</Title>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('Flashcard', { deckId, flashcardId: flashcards[0]?.id })}
        style={styles.studyButton}
      >
        Study
      </Button>
      <FlatList
        data={flashcards}
        renderItem={renderFlashcardItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('EditCard', { deckId })}
      />
      <Portal>
        <Dialog visible={isDeleteDialogVisible} onDismiss={() => setIsDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Deck</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete this deck? This action cannot be undone.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteDeck}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  studyButton: {
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DeckScreen;