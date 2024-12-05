import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, FAB, Menu, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { RootStackParamList } from '../types/navigation';
import { useAppState } from '../contexts/AppStateContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { decks, exportDecks, importDecks } = useAppState();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleExport = async () => {
    try {
      const data = await exportDecks();
      const jsonString = JSON.stringify(data, null, 2);
      
      const fileName = `flashcards_${new Date().toISOString().slice(0, 10)}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json'
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
        const importedData = JSON.parse(fileContent);
        await importDecks(importedData);
      }
    } catch (error) {
      console.error('Import failed:', error);
    }
  };



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
          <Menu.Item 
            onPress={() => {
              setIsMenuVisible(false);
              handleExport();
            }} 
            title="Export Decks" 
          />
          <Menu.Item 
            onPress={() => {
              setIsMenuVisible(false);
              handleImport();
            }} 
            title="Import Decks" 
          />
        </Menu>
      ),
    });
  }, [navigation, isMenuVisible]);


  const handleDeckPress = (deckId: number) => {
    navigation.navigate('Deck', { deckId });
  };

  const handleAddDeck = () => {
    navigation.navigate('CreateDeck');
  };


  return (
    <View style={styles.container}>
      {decks.map((deck) => (
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