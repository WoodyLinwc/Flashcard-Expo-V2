# FlashcardApp — AI README

A comprehensive technical reference for the FlashcardApp, a cross-platform mobile flashcard study application built with React Native and Expo.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Features](#features)
6. [Screens](#screens)
7. [Components](#components)
8. [State Management](#state-management)
9. [Database Layer](#database-layer)
10. [Navigation](#navigation)
11. [Import / Export System](#import--export-system)
12. [TypeScript Types & Navigation Types](#typescript-types--navigation-types)
13. [Build & Configuration](#build--configuration)
14. [Developer Notes](#developer-notes)

---

## Project Overview

FlashcardApp is a mobile-first flashcard study application built with **React Native (Expo)**. Users can create decks of flashcards, study them with animated card-flipping, search/filter content, and import/export decks as JSON files. All data is persisted locally using **SQLite** via `expo-sqlite`.

- **Version:** 1.2.0
- **Platform targets:** iOS, Android, Web (via `react-native-web`)
- **New Architecture enabled:** Yes (`newArchEnabled: true` in `app.json`)

---

## Tech Stack

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Framework        | React Native 0.79.4                |
| Build toolchain  | Expo SDK ~53                       |
| Language         | TypeScript ~5.8                    |
| Navigation       | React Navigation v6 (Stack)        |
| UI Components    | React Native Paper v5              |
| Local database   | expo-sqlite ~15.2                  |
| File system      | expo-file-system                   |
| File sharing     | expo-sharing                       |
| Document picking | expo-document-picker               |
| Media library    | expo-media-library                 |
| Gesture handling | react-native-gesture-handler ~2.24 |
| Animations       | React Native Animated API          |
| State management | React Context API                  |

---

## Project Structure

```
FlashcardApp/
├── App.tsx                        # Root component, navigation container, providers
├── app.json                       # Expo configuration
├── package.json
├── tsconfig.json
├── babel.config.js
├── eas.json                       # EAS Build configuration
├── assets/                        # App icons, splash screen
├── notes/                         # Developer reference notes
│   ├── hooks.md
│   └── react.md
└── src/
    ├── components/
    │   ├── CreateCard.tsx         # Controlled form for adding a card
    │   ├── CreateDeck.tsx         # Controlled form for creating a deck
    │   ├── DeckList.tsx           # FlatList of decks (context-driven)
    │   ├── Flashcard.tsx          # Animated flip card component
    │   ├── ImportExport.tsx       # Menu items for import/export actions
    │   └── SearchBar.tsx          # Reusable search input wrapper
    ├── contexts/
    │   └── AppStateContext.tsx    # Global state + all DB operations
    ├── screens/
    │   ├── HomeScreen.tsx         # Deck list with search, import/export
    │   ├── DeckScreen.tsx         # Cards in a deck, study button, CRUD
    │   ├── FlashcardScreen.tsx    # Study mode with flip + swipe navigation
    │   ├── CreateDeckScreen.tsx   # Wrapper screen for CreateDeck component
    │   └── EditCardScreen.tsx     # Add or edit a single flashcard
    └── types/
        └── navigation.tsx         # All navigation prop/route types
```

---

## Architecture

The app follows a **provider-screen-component** pattern:

```
App.tsx
 └── PaperProvider          (React Native Paper theming)
      └── AppStateProvider  (Global state + SQLite via Context API)
           └── NavigationContainer
                └── Stack.Navigator
                     ├── HomeScreen
                     ├── DeckScreen
                     ├── FlashcardScreen
                     ├── CreateDeckScreen
                     └── EditCardScreen
```

**Data flow:**

1. `AppStateContext` initialises the SQLite database on mount.
2. All CRUD operations are async functions exposed via context.
3. Screens consume context via `useAppState()` and call those async functions directly.
4. Local `useState` in each screen handles ephemeral UI state (dialogs, search queries, loading flags).

---

## Features

### Deck Management

- **Create** a named deck via a dedicated screen.
- **Rename** a deck from the deck detail screen via a dialog.
- **Delete** a deck (with confirmation dialog) — cascades to delete all associated cards.
- **Search / filter** decks by name on the home screen (client-side, real-time with `useMemo`).
- **Card count** is displayed per deck and kept in sync via DB triggers on the application layer.

### Flashcard Management

- **Add** cards to a deck (front + back text fields).
- **Edit** existing cards.
- **Delete** cards with confirmation dialog.
- **Search / filter** cards within a deck by front or back text (client-side, real-time with `useMemo`).

### Study Mode

- Displays one card at a time with a **3D flip animation** (Y-axis rotation using React Native's `Animated` API).
- Tap anywhere on the card to flip between front and back.
- Navigate between cards via **Previous / Next buttons**.
- Navigate between cards via **left/right swipe gestures** (`PanGestureHandler` from `react-native-gesture-handler`).
- **Shuffle** the deck order with a header icon button.
- Progress is tracked by `currentIndex` state; flipped state resets on card change.

### Import / Export

- **Export** all decks and their cards to a structured JSON file, shared via the native share sheet.
- **Import** decks from a `.json` file picked via the system document picker.
- Import is **non-destructive**: decks whose names already exist are skipped; only new decks are added.
- Import runs inside a **SQLite transaction** (rolls back on failure).
- Post-import feedback alerts list which decks were added and which were skipped.

### Search

- **HomeScreen:** search bar filters the deck list by name.
- **DeckScreen:** search bar filters the card list by front or back content.
- Both use `useMemo` for efficient re-computation on query change.

---

## Screens

### `HomeScreen`

**Route:** `Home` (initial route)

Displays all decks in a scrollable list. Provides:

- A `SearchBarComponent` for filtering decks.
- A `FAB` (`+`) to navigate to `CreateDeck`.
- A header menu (`⋮`) containing Import/Export actions.
- Each deck row navigates to `DeckScreen` on press.

**Key hooks:** `useMemo` for filtered deck list, `useEffect` for dynamic header.

---

### `DeckScreen`

**Route:** `Deck` — receives `{ deckId: number }`

Displays flashcards belonging to a specific deck. Provides:

- A search bar for filtering cards.
- A "Study" button navigating to `FlashcardScreen`.
- A `FAB` to add a new card (navigates to `EditCardScreen` without `cardId`).
- Each card row navigates to `EditCardScreen` with `cardId` for editing.
- A header menu (`⋮`) with Rename and Delete Deck options (each with confirmation dialogs).
- Loading indicator while data fetches.
- Empty-state message when no cards exist or no results match the search.

**Key hooks:** `useFocusEffect` to reload cards when returning from editing, `useCallback` to memoize loaders, `useMemo` for filtered list.

---

### `FlashcardScreen`

**Route:** `Flashcard` — receives `{ deckId: number; flashcardId?: number }`

The core study experience. Displays one card at a time:

- Wraps content in a `PanGestureHandler` for swipe navigation.
- Tap on the card area flips it (calls `setIsFlipped`).
- Previous / Next buttons with disabled states at deck boundaries.
- Shuffle button in the header randomises card order.
- Empty state with an "Add Card" button if the deck has no cards.

---

### `CreateDeckScreen`

**Route:** `CreateDeck`

Simple wrapper that renders the `CreateDeck` component and navigates back on successful deck creation.

---

### `EditCardScreen`

**Route:** `EditCard` — receives `{ deckId: number; cardId?: number }`

Dual-purpose screen:

- **Add mode** (`cardId` is undefined): empty form, calls `addFlashcard` on save.
- **Edit mode** (`cardId` is defined): pre-populates form from DB, calls `updateFlashcard` on save. Shows a delete icon in the header, triggering a confirmation dialog that calls `deleteFlashcard`.

---

## Components

### `Flashcard`

**Props:** `front: string`, `back: string`, `isFlipped: boolean`

Renders two absolutely-positioned `Card` faces. Uses `Animated.spring` on `flipAnimation` (a `Value` from `0` to `180`) to drive `rotateY` interpolations on each face. `backfaceVisibility: 'hidden'` ensures only the correct face is visible. The parent controls the `isFlipped` prop.

---

### `CreateCard`

**Props:** `onSubmit: (front: string, back: string) => void`

Stateful form with two `TextInput` fields (front, back) and a submit button. Clears the form after successful submission. Validates that both fields are non-empty before calling `onSubmit`.

---

### `CreateDeck`

**Props:** `onDeckCreated: () => void`

Calls `addDeck` from context. Validates non-empty input. Invokes `onDeckCreated` callback after successful creation.

---

### `DeckList`

**Props:** `onDeckPress: (deckId: number) => void`

Reads `decks` directly from `AppStateContext` and renders them in a `FlatList`. Useful as a standalone presentational-with-context component.

---

### `ImportExportMenu`

**Props:** `isVisible`, `onDismiss`, `onExport`, `onImport`

Renders two `Menu.Item` elements for export and import. Handles the full file-system workflow internally (write/read via `expo-file-system`, share via `expo-sharing`, pick via `expo-document-picker`). Calls the passed `onExport` / `onImport` callbacks for the actual data logic.

---

### `SearchBarComponent`

**Props:** `value: string`, `onChangeText: (text: string) => void`, `placeholder?: string`

Thin wrapper around React Native Paper's `Searchbar`. Adds consistent padding styling.

---

## State Management

All application state lives in `AppStateContext` (`src/contexts/AppStateContext.tsx`).

### State shape

```typescript
type AppState = {
  decks: Deck[]; // In-memory array, kept in sync with DB
  addDeck;
  getDeck;
  updateDeck;
  deleteDeck;
  getFlashcards;
  getFlashcard;
  updateFlashcard;
  addFlashcard;
  deleteFlashcard;
  exportDecks;
  importDecks;
};
```

### Key design decisions

- `decks` is maintained in memory as a `Deck[]` array and updated optimistically after every mutation, avoiding full DB re-reads on simple operations.
- `cardCount` on each deck is maintained both in the DB column and in the in-memory state — incremented/decremented on add/delete.
- `getFlashcards`, `getFlashcard` always read from the DB (not cached) to ensure freshness.
- The `db` instance is stored in a `useState<SQLiteDatabase | null>` and initialised once in a `useEffect` on mount.

---

## Database Layer

**Engine:** SQLite via `expo-sqlite` (async API)

### Schema

```sql
CREATE TABLE IF NOT EXISTS decks (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT,
  cardCount INTEGER
);

CREATE TABLE IF NOT EXISTS flashcards (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  deckId INTEGER,
  front  TEXT,
  back   TEXT
);
```

### Notable patterns

- `db.execAsync` is used for DDL (schema creation) and transaction control (`BEGIN`, `COMMIT`, `ROLLBACK`).
- `db.runAsync` is used for INSERT, UPDATE, DELETE — returns `{ lastInsertRowId, changes }`.
- `db.getAllAsync<T>` is used for SELECT queries returning multiple rows.
- `db.getFirstAsync<T>` is used for single-row lookups.
- `deleteDeck` cascades manually: it deletes the deck row then all flashcard rows with the matching `deckId`.
- `importDecks` wraps all inserts in an explicit transaction for atomicity.

---

## Navigation

Built with **React Navigation v6 Stack Navigator**.

### Route definitions (`RootStackParamList`)

```typescript
type RootStackParamList = {
  Home: undefined;
  Deck: { deckId: number };
  Flashcard: { deckId: number; flashcardId?: number };
  CreateDeck: undefined;
  EditCard: { deckId: number; cardId?: number };
};
```

### Screen titles

- `Home` → "Decks"
- `Flashcard` → "Study"
- `Deck` → set dynamically to the deck name via `navigation.setOptions`
- `EditCard` → set dynamically to "Edit Card" or "Add Card" depending on whether `cardId` is present

### Header customisation

`DeckScreen`, `FlashcardScreen`, and `EditCardScreen` all use `navigation.setOptions` inside `useEffect` to inject custom header right buttons (menu icons, shuffle, delete).

---

## Import / Export System

### Export format

```json
{
  "decks": [
    {
      "name": "Deck Name",
      "cards": [{ "front": "Question", "back": "Answer" }]
    }
  ]
}
```

### Export flow

1. `exportDecks()` in context reads all decks then all cards for each deck from SQLite.
2. `ImportExportMenu` serialises the result to JSON, writes it to `FileSystem.documentDirectory`, then calls `Sharing.shareAsync`.

### Import flow

1. User picks a `.json` file via `DocumentPicker.getDocumentAsync`.
2. File is read with `FileSystem.readAsStringAsync` and parsed.
3. `importDecks(data)` in context:
   - Fetches existing deck names into a `Set`.
   - Begins a SQLite transaction.
   - For each deck in the import: skips if name exists, otherwise inserts deck and all its cards.
   - Commits the transaction (or rolls back on error).
   - Refreshes the in-memory `decks` array.
4. Returns `{ added: string[], skipped: string[] }` for user feedback.

---

## TypeScript Types & Navigation Types

All navigation types are centralised in `src/types/navigation.tsx`:

```typescript
// Navigation prop types (for useNavigation)
HomeScreenNavigationProp;
DeckScreenNavigationProp;
FlashcardScreenNavigationProp;
CreateDeckScreenNavigationProp;
EditCardScreenNavigationProp;

// Route prop types (for useRoute)
DeckScreenRouteProp;
FlashcardScreenRouteProp;
EditCardScreenRouteProp;
```

Core data types are defined in `AppStateContext.tsx`:

```typescript
type Deck = { id: number; name: string; cardCount: number };
type Flashcard = { id: number; front: string; back: string; deckId: number };
type ExportData = {
  decks: { name: string; cards: { front: string; back: string }[] }[];
};
type ImportResult = { added: string[]; skipped: string[] };
```

---

## Build & Configuration

### `app.json` highlights

- **Slug:** `FlashcardApp`
- **Bundle ID (Android):** `com.woodylinwc.FlashcardApp`
- **Target/Compile SDK:** 35
- **Plugins:** `expo-sqlite` (required for native SQLite support)
- **New Architecture:** enabled

### `eas.json` build profiles

| Profile       | Platform | Type     | Notes                                             |
| ------------- | -------- | -------- | ------------------------------------------------- |
| `development` | any      | internal | Dev client build                                  |
| `preview`     | Android  | APK      | Unsigned APK for testing                          |
| `preview2`    | Android  | APK      | Via `assembleRelease` Gradle command              |
| `preview3`    | any      | internal | Dev client variant                                |
| `production`  | Android  | AAB      | Auto-increment version, app bundle for Play Store |

### Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Start with Android target
npm run ios        # Start with iOS target
npm run web        # Start with web target
```

---

## Developer Notes

- The `notes/` directory contains developer reference markdown files covering `useState` vs `useImmer` patterns and general React/React Native concepts. These are internal learning notes and not part of the production build.
- `DeckList.tsx` reads directly from context but is not currently used by any screen — screens manage their own list rendering directly. It exists as a reusable component.
- `FlashcardScreen` receives a `flashcardId` route param but does not use it — the screen always loads all cards for the deck and starts from index 0.
- Card count in the `decks` table is maintained by the application layer (not a DB trigger), so it is possible for it to drift if operations fail mid-flight. The `importDecks` function sets `cardCount` correctly to `deck.cards.length` at import time.
- The `backfaceVisibility: 'hidden'` style on `Flashcard` may behave differently on Android vs iOS with the New Architecture enabled — test on both platforms if animation issues arise.
