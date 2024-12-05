import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import * as DocumentPicker from 'expo-document-picker';

type Deck = {
  id: number;
  name: string;
  cardCount: number;
};

type Flashcard = {
  id: number;
  front: string;
  back: string;
  deckId: number;
};

type ExportData = {
  decks: {
    name: string;
    cards: {
      front: string;
      back: string;
    }[];
  }[];
};

type AppState = {
  decks: Deck[];
  addDeck: (name: string) => Promise<void>;
  getDeck: (deckId: number) => Promise<Deck | null>;
  updateDeck: (deckId: number, newName: string) => Promise<void>;
  deleteDeck: (deckId: number) => Promise<void>;
  getFlashcards: (deckId: number) => Promise<Flashcard[]>;
  getFlashcard: (deckId: number, flashcardId: number) => Promise<Flashcard | null>;
  updateFlashcard: (deckId: number, flashcardId: number, front: string, back: string) => Promise<void>;
  addFlashcard: (deckId: number, front: string, back: string) => Promise<void>;
  deleteFlashcard: (deckId: number, flashcardId: number) => Promise<void>;
  exportDecks: () => Promise<ExportData>;
  importDecks: (data: ExportData) => Promise<void>;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

type AppStateProviderProps = {
  children: ReactNode;
};

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      const database = await SQLite.openDatabaseAsync('flashcards.db');
      setDb(database);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS decks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, cardCount INTEGER);
        CREATE TABLE IF NOT EXISTS flashcards (id INTEGER PRIMARY KEY AUTOINCREMENT, deckId INTEGER, front TEXT, back TEXT);
      `);

      const allDecks = await database.getAllAsync<Deck>('SELECT * FROM decks');
      setDecks(allDecks);
    };

    initDatabase();
  }, []);

  const addDeck = async (name: string): Promise<void> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.runAsync('INSERT INTO decks (name, cardCount) VALUES (?, ?)', name, 0);
    const newDeck: Deck = { id: result.lastInsertRowId, name, cardCount: 0 };
    setDecks((prevDecks) => [...prevDecks, newDeck]);
  };

  const getDeck = async (deckId: number): Promise<Deck | null> => {
    if (!db) throw new Error('Database not initialized');

    const deck = await db.getFirstAsync<Deck>('SELECT * FROM decks WHERE id = ?', deckId);
    return deck || null;
  };

  const updateDeck = async (deckId: number, newName: string): Promise<void> => {
    if (!db) throw new Error('Database not initialized');

    await db.runAsync(
      'UPDATE decks SET name = ? WHERE id = ?',
      newName,
      deckId
    );

    setDecks(prevDecks => 
      prevDecks.map(deck => 
        deck.id === deckId ? { ...deck, name: newName } : deck
      )
    );
  };

  const deleteDeck = async (deckId: number): Promise<void> => {
    if (!db) throw new Error('Database not initialized');

    await db.runAsync('DELETE FROM decks WHERE id = ?', deckId);
    await db.runAsync('DELETE FROM flashcards WHERE deckId = ?', deckId);

    setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
  };

  const getFlashcards = async (deckId: number): Promise<Flashcard[]> => {
    if (!db) throw new Error('Database not initialized');

    return await db.getAllAsync<Flashcard>('SELECT * FROM flashcards WHERE deckId = ?', deckId);
  };

  const getFlashcard = async (deckId: number, flashcardId: number): Promise<Flashcard | null> => {
    if (!db) throw new Error('Database not initialized');

    const flashcard = await db.getFirstAsync<Flashcard>(
      'SELECT * FROM flashcards WHERE id = ? AND deckId = ?',
      flashcardId,
      deckId
    );

    return flashcard || null;
  };

  const updateFlashcard = async (deckId: number, flashcardId: number, front: string, back: string): Promise<void> => {
    if (!db) throw new Error('Database not initialized');

    await db.runAsync(
      'UPDATE flashcards SET front = ?, back = ? WHERE id = ? AND deckId = ?',
      front,
      back,
      flashcardId,
      deckId
    );
  };

  const addFlashcard = async (deckId: number, front: string, back: string): Promise<void> => {
    if (!db) throw new Error('Database not initialized');

    await db.runAsync(
      'INSERT INTO flashcards (deckId, front, back) VALUES (?, ?, ?)',
      deckId,
      front,
      back
    );

    await db.runAsync(
      'UPDATE decks SET cardCount = cardCount + 1 WHERE id = ?',
      deckId
    );

    setDecks(prevDecks => 
      prevDecks.map(deck => 
        deck.id === deckId ? { ...deck, cardCount: deck.cardCount + 1 } : deck
      )
    );
  };

  const deleteFlashcard = async (deckId: number, flashcardId: number): Promise<void> => {
    if (!db) throw new Error('Database not initialized');

    await db.runAsync('DELETE FROM flashcards WHERE id = ? AND deckId = ?', flashcardId, deckId);

    await db.runAsync(
      'UPDATE decks SET cardCount = cardCount - 1 WHERE id = ?',
      deckId
    );

    setDecks(prevDecks => 
      prevDecks.map(deck => 
        deck.id === deckId ? { ...deck, cardCount: Math.max(0, deck.cardCount - 1) } : deck
      )
    );
  };


  const exportDecks = async (): Promise<ExportData> => {
    if (!db) throw new Error('Database not initialized');

    // Get all decks
    const allDecks = await db.getAllAsync<Deck>('SELECT * FROM decks');
    const exportData: ExportData = { decks: [] };

    // For each deck, get its cards
    for (const deck of allDecks) {
      const cards = await db.getAllAsync<Flashcard>(
        'SELECT * FROM flashcards WHERE deckId = ?',
        deck.id
      );

      exportData.decks.push({
        name: deck.name,
        cards: cards.map(card => ({
          front: card.front,
          back: card.back
        }))
      });
    }

    return exportData;
  };

  const importDecks = async (data: ExportData): Promise<void> => {
    if (!db) throw new Error('Database not initialized');

    // Begin transaction
    await db.execAsync('BEGIN TRANSACTION');

    try {
      // Clear existing data
      await db.execAsync('DELETE FROM flashcards');
      await db.execAsync('DELETE FROM decks');

      // Import new data
      for (const deck of data.decks) {
        const deckResult = await db.runAsync(
          'INSERT INTO decks (name, cardCount) VALUES (?, ?)',
          deck.name,
          deck.cards.length
        );

        const deckId = deckResult.lastInsertRowId;

        // Add cards
        for (const card of deck.cards) {
          await db.runAsync(
            'INSERT INTO flashcards (deckId, front, back) VALUES (?, ?, ?)',
            deckId,
            card.front,
            card.back
          );
        }
      }

      // Commit transaction
      await db.execAsync('COMMIT');

      // Refresh decks state
      const updatedDecks = await db.getAllAsync<Deck>('SELECT * FROM decks');
      setDecks(updatedDecks);
    } catch (error) {
      // Rollback on error
      await db.execAsync('ROLLBACK');
      throw error;
    }
  };

  const value: AppState = {
    decks,
    addDeck,
    getDeck,
    updateDeck,
    deleteDeck,
    getFlashcards,
    getFlashcard,
    updateFlashcard,
    addFlashcard,
    deleteFlashcard,
    exportDecks,
    importDecks,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = (): AppState => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};