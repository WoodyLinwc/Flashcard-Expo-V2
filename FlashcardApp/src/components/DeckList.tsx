import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useAppState } from '../contexts/AppStateContext';

type DeckListProps = {
  onDeckPress: (deckId: number) => void;
};

const DeckList: React.FC<DeckListProps> = ({ onDeckPress }) => {
  const { decks } = useAppState();

  const renderItem = ({ item }: { item: { id: number; name: string; cardCount: number } }) => (
    <List.Item
      title={item.name}
      description={`${item.cardCount} cards`}
      onPress={() => onDeckPress(item.id)}
      right={props => <List.Icon {...props} icon="chevron-right" />}
    />
  );

  return (
    <FlatList
      data={decks}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

export default DeckList;