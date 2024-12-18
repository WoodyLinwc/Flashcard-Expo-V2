# Flashcard Simple (1.1.0) 

[Google Play Store: Flashcard Simple](https://play.google.com/store/apps/details?id=com.woodylinwc.FlashcardApp)

1.1.0 update notes: Now you can import/export your decks and flashcards to other devices! You can also search for a specific deck and card.

# Description
**Flashcard Simple** is a lightweight and intuitive flashcard app designed for both iOS and Android devices. It offers a user-friendly interface for creating, managing, and studying flashcards. With features like deck management, flashcard operations, and study tools, this app is perfect for anyone looking to improve their learning experience.

![](/img/flashcard.jpg)

# Technologies
- **React Native**: allows for **cross-platform** development, meaning we can create both iOS and Android apps with a single codebase. Used as the primary framework for building the entire flashcard app.

- **TypeScript**: adds static typing to JavaScript, which helps catch errors early in the development process, improves code readability, and provides better IntelliSense in IDEs.

- **SQLite**: provides a lightweight, **serverless** database solution which allows our app to store and retrieve data locally, enabling **offline** functionality and fast data access. Used for local data storage, managing decks and flashcards.

- **Expo**: simplifies the React Native development process by providing a set of **pre-built** components and tools. Used as the development framework and for accessing native APIs.

- **React Navigation**: provides a simple way to manage **navigation state** and transition between screens. It is the standard routing library for React Native.

- **React Native Paper**: provides a set of customizable, pre-built UI components that follow **Material Design** guidelines. 

- **React Native Gesture Handler**: provides more responsive and fluid gesture handling compared to the built-in React Native gesture system. Used in the FlashcardScreen for implementing swipe gestures to navigate between cards.

- **React Hooks**: allow us to use state and other React features in functional components.

- **React Context API**: provides a way to pass data through the component tree without having to pass props down manually at every level. Used for **global state** management, particularly in the AppStateContext for managing decks and flashcards.

- **React Native Animated API**: Used in the Flashcard component for creating the card flip animation.

- **Expo DocumentPicker, FileSystem, and Sharing modules**: provide ways to pick a file with `expo-document-picker`, process it with `expo-file-system`, and share the file externally with `expo-sharing`.

# Features
### Decks Management
1. Create Decks: Users can create multiple decks to organize their flashcards by subject or topic.
2. Rename Decks: Ability to rename existing decks.
3. Delete Decks: Option to remove entire decks when they're no longer needed.
4. Search Decks: Users can search for specific decks using a search bar.

### Flashcard Operations
1. Add Flashcards: Users can add new flashcards to any deck, inputting both front and back content.
2. Edit Flashcards: Existing flashcards can be modified to update their content.
3. Delete Flashcards: Remove individual flashcards from a deck.
4. Search Flashcards: Users can search for specific flashcards within a deck.

### Study Features
1. Flashcard Flipping: Interactive card flipping animation to reveal the answer side.
2. Navigation Controls:
    - "Next" and "Previous" buttons to move between cards.
    - Swipe gestures (left/right) for quick navigation between cards.
3. Shuffle Functionality: Option to randomize the order of flashcards in a deck for varied study sessions.

### Data Management
1. Local Storage: All deck and flashcard data is stored locally on the device using **SQLite**.
2. Offline Functionality: The app works fully **offline**, allowing study anytime, anywhere.
3. Import/Export: Users can **import** and **export** decks and flashcards to share their progress with others or back up their data.
4. Search feature: Users can **search** for specific cards or decks using a search bar.

### User Interface
1. Intuitive Design: Clean and user-friendly interface for easy navigation and use.
2. Deck List: Main screen displays all created decks with their respective card counts.
3. Card List: Within each deck, users can view a list of all flashcards.
4. Study Mode: Dedicated screen for studying flashcards with a focus on the current card.

# What's Next?
- ~~I'm considering adding a feature to allow users to import and export decks and cards.~~(Done, 12/10/2024)

- A quiz and test mode will be good!

- ~~A search bar that helps users find specific cards or decks.~~(Done, 12/3/2024)



# Release History
- 1.0.0 (10/2/2024) Submit to Google Play Console for review!
- 1.0.0 (10/5/2024) Closed Testing
- 1.0.0 (10/22/2024) Open Testing and first production release!
- 1.1.0 (12/10/2024) Import/export your decks and flashcards to other devices and search for a specific deck and card.

# License
This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.

To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/ 
