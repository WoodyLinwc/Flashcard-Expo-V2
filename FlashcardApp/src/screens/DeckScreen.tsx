import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, FAB, Button, Title, IconButton, Dialog, Portal, Paragraph, Menu, TextInput, ActivityIndicator } from 'react-native-paper';
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
  const { getFlashcards, getDeck, deleteDeck, updateDeck } = useAppState();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [deckName, setDeckName] = useState('');
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isRenameDialogVisible, setIsRenameDialogVisible] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadDeckAndFlashcards = useCallback(async () => {
    setIsLoading(true);
    const deck = await getDeck(deckId);
    if (deck) {
      setDeckName(deck.name);
      navigation.setOptions({
        title: deck.name,
      });
    }
    const cards = await getFlashcards(deckId);
    setFlashcards(cards);
    setIsLoading(false);
  }, [deckId, getDeck, getFlashcards, navigation]);

  useEffect(() => {
    loadDeckAndFlashcards();
  }, [loadDeckAndFlashcards]);

  useFocusEffect(
    useCallback(() => {
      loadDeckAndFlashcards();
    }, [loadDeckAndFlashcards])
  );

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
          <Menu.Item onPress={() => {
            setIsMenuVisible(false);
            setIsRenameDialogVisible(true);
          }} title="Rename Deck" />
          <Menu.Item onPress={() => {
            setIsMenuVisible(false);
            setIsDeleteDialogVisible(true);
          }} title="Delete Deck" />
        </Menu>
      ),
    });
  }, [navigation, isMenuVisible]);

  const handleDeleteDeck = async () => {
    await deleteDeck(deckId);
    navigation.goBack();
  };

  const handleRenameDeck = async () => {
    if (newDeckName.trim()) {
      await updateDeck(deckId, newDeckName.trim());
      setDeckName(newDeckName.trim());
      setIsRenameDialogVisible(false);
      navigation.setOptions({ title: newDeckName.trim() });
    }
  };

  const handleStudy = () => {
    navigation.navigate('Flashcard', { 
      deckId, 
      flashcardId: flashcards.length > 0 ? flashcards[0].id : undefined 
    });
  };

  const renderFlashcardItem = ({ item }: { item: Flashcard }) => (
    <List.Item
      title={item.front}
      onPress={() => navigation.navigate('EditCard', { deckId, cardId: item.id })}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{deckName}</Title>
      <Button 
        mode="contained" 
        onPress={handleStudy}
        style={styles.studyButton}
      >
        Study
      </Button>
      <FlatList
        data={flashcards}
        renderItem={renderFlashcardItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        ListEmptyComponent={
          <Paragraph style={styles.emptyMessage}>No cards in this deck. Add some to start studying!</Paragraph>
        }
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
        <Dialog visible={isRenameDialogVisible} onDismiss={() => setIsRenameDialogVisible(false)}>
          <Dialog.Title>Rename Deck</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="New Deck Name"
              value={newDeckName}
              onChangeText={setNewDeckName}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsRenameDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleRenameDeck}>Rename</Button>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DeckScreen;