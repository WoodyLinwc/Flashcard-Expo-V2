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
  addDeck: (name: string) => Promise<void>;
  getDeck: (deckId: number) => Promise<Deck | null>;
  updateDeck: (deckId: number, newName: string) => Promise<void>;
  deleteDeck: (deckId: number) => Promise<void>;
  getFlashcards: (deckId: number) => Promise<Flashcard[]>;
  getFlashcard: (deckId: number, flashcardId: number) => Promise<Flashcard | null>;
  updateFlashcard: (deckId: number, flashcardId: number, front: string, back: string) => Promise<void>;
  addFlashcard: (deckId: number, front: string, back: string) => Promise<void>;
  deleteFlashcard: (deckId: number, flashcardId: number) => Promise<void>;
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