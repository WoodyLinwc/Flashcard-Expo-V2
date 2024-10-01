import React from 'react';
import { View, FlatList } from 'react-native';
import { List, FAB } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { useAppState } from '../contexts/AppStateContext';
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { decks } = useAppState();

  const renderDeckItem = ({ item }: { item: { id: number; name: string; cardCount: number } }) => (
    <List.Item
      title={item.name}
      description={`${item.cardCount} cards`}
      onPress={() => navigation.navigate('Deck', { deckId: item.id })}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={decks}
        renderItem={renderDeckItem}
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
        onPress={() => {/* TODO: Implement add new deck */}}
      />
    </View>
  );
};

export default HomeScreen;