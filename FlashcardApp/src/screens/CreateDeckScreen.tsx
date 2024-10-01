import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CreateDeck from '../components/CreateDeck';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type CreateDeckScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateDeck'>;

const CreateDeckScreen: React.FC = () => {
  const navigation = useNavigation<CreateDeckScreenNavigationProp>();

  const handleDeckCreated = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CreateDeck onDeckCreated={handleDeckCreated} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default CreateDeckScreen;