
## useState vs useImmer
filter, map vs push, splice, sort
```
import React, { useState } from 'react';
import { useImmer } from 'use-immer';

export default function ListComponent() {
  const [items, setItems] = useState([1, 2, 3, 4, 5]); // Initial array
  const [items, updateItems] = useImmer([1, 2, 3, 4, 5]);

  const addItem = (newItem) => {
    setItems(prevItems => [...prevItems, newItem]);

    updateItems(draft => {
      draft.push(newItem); 
    });
  };

  const deleteItem = (index) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));

    updateItems(draft => {
      draft.splice(index, 1); 
    });
  };

  const replaceItem = (index, newItem) => {
    setItems(prevItems => prevItems.map((item, i) => i === index ? newItem : item));

    updateItems(draft => {
      draft[index] = newItem; 
    });
  };

  const sortItems = () => {
    setItems(prevItems => [...prevItems].sort((a, b) => a - b));

    updateItems(draft => {
      draft.sort((a, b) => a - b); 
    });
  };

  return (
    <div>
      <h1>Item List</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button onClick={() => addItem(6)}>Add Item</button>
      <button onClick={() => deleteItem(0)}>Delete First Item</button>
      <button onClick={() => replaceItem(1, 10)}>Replace Second Item with 10</button>
      <button onClick={sortItems}>Sort Items</button>
    </div>
  );
}


```


## useEffect


