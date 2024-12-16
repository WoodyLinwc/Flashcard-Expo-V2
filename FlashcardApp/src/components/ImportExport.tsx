import React from 'react';
import { Menu } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Add ImportResult type
type ImportResult = {
  added: string[];
  skipped: string[];
};

type ImportExportMenuProps = {
  isVisible: boolean;
  onDismiss: () => void;
  onExport: () => Promise<any>;
  onImport: (data: any) => Promise<ImportResult>; 
};

const ImportExportMenu: React.FC<ImportExportMenuProps> = ({
  isVisible,
  onDismiss,
  onExport,
  onImport
}) => {
  const handleExport = async () => {
    try {
      const data = await onExport();
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
        const importResult = await onImport(importedData);
        
        let message = '';
        
        if (importResult.added.length > 0) {
          message += `Added decks:\n${importResult.added.join('\n')}\n\n`;
        }
        
        if (importResult.skipped.length > 0) {
          message += `Skipped existing decks:\n${importResult.skipped.join('\n')}`;
        }
  
        if (!message) {
          message = 'No new decks to import.';
        }
        
        alert(message);
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please check the file JSON format again.');
    }
  };

  return (
    <>
      <Menu.Item 
        onPress={() => {
          onDismiss();
          handleExport();
        }} 
        title="Export Decks" 
      />
      <Menu.Item 
        onPress={() => {
          onDismiss();
          handleImport();
        }} 
        title="Import Decks" 
      />
    </>
  );
};

export default ImportExportMenu;