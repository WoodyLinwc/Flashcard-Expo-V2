import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { List, FAB } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useAppState } from '../contexts/AppStateContext';

type RootStackParamList = {
  Home: undefined;
  Deck: { deckId: number };
  Flashcard: { flashcardId: number; deckId: number };
};

type DeckScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Deck'>;
type DeckScreenRouteProp = RouteProp<RootStackParamList, 'Deck'>;

type Props = {
  navigation: DeckScreenNavigationProp;
  route: DeckScreenRouteProp;
};

type Flashcard = {
  id: number;
  front: string;
  back: string;
};

const DeckScreen: React.FC<Props> = ({ navigation, route }) => {
  const { deckId } = route.params;
  const { getFlashcards } = useAppState();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const loadFlashcards = async () => {
      const cards = await getFlashcards(deckId);
      setFlashcards(cards);
    };
    loadFlashcards();
  }, [deckId, getFlashcards]);

  const renderFlashcardItem = ({ item }: { item: Flashcard }) => (
    <List.Item
      title={item.front}
      description="Tap to view"
      onPress={() => navigation.navigate('Flashcard', { flashcardId: item.id, deckId })}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={flashcards}
        renderItem={renderFlashcardItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        icon="plus"
        onPress={() => {/* TODO: Implement add new flashcard */}}
      />
    </View>
  );
};

export default DeckScreen;