import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';

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

type AppState = {
  decks: Deck[];
  addDeck: (name: string) => Promise<number>;
  getFlashcards: (deckId: number) => Promise<Flashcard[]>;
  getFlashcard: (deckId: number, flashcardId: number) => Promise<Flashcard | null>;
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

  const addDeck = async (name: string): Promise<number> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.runAsync('INSERT INTO decks (name, cardCount) VALUES (?, ?)', [name, 0]);
    const newDeck: Deck = { id: result.lastInsertRowId, name, cardCount: 0 };
    setDecks((prevDecks) => [...prevDecks, newDeck]);
    return result.lastInsertRowId;
  };

  const getFlashcards = async (deckId: number): Promise<Flashcard[]> => {
    if (!db) throw new Error('Database not initialized');

    return await db.getAllAsync<Flashcard>('SELECT * FROM flashcards WHERE deckId = ?', [deckId]);
  };

  const getFlashcard = async (deckId: number, flashcardId: number): Promise<Flashcard | null> => {
    if (!db) throw new Error('Database not initialized');

    const flashcard = await db.getFirstAsync<Flashcard>(
      'SELECT * FROM flashcards WHERE id = ? AND deckId = ?',
      [flashcardId, deckId]
    );

    return flashcard || null;
  };

  const value: AppState = {
    decks,
    addDeck,
    getFlashcards,
    getFlashcard,
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