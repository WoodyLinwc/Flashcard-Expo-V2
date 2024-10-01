import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useAppState } from '../contexts/AppStateContext';

type CreateDeckProps = {
  onDeckCreated: () => void;
};

const CreateDeck: React.FC<CreateDeckProps> = ({ onDeckCreated }) => {
  const [deckName, setDeckName] = useState('');
  const { addDeck } = useAppState();

  const handleCreateDeck = async () => {
    if (deckName.trim()) {
      await addDeck(deckName.trim());
      setDeckName('');
      onDeckCreated();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Deck Name"
        value={deckName}
        onChangeText={setDeckName}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleCreateDeck} disabled={!deckName.trim()}>
        Create Deck
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default CreateDeck;