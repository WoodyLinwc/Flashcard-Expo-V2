import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

type CreateCardProps = {
  onSubmit: (front: string, back: string) => void;
};

const CreateCard: React.FC<CreateCardProps> = ({ onSubmit }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSubmit = () => {
    if (front.trim() && back.trim()) {
      onSubmit(front, back);
      setFront('');
      setBack('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Front"
        value={front}
        onChangeText={setFront}
        style={styles.input}
      />
      <TextInput
        label="Back"
        value={back}
        onChangeText={setBack}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSubmit}>
        Create Card
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

export default CreateCard;