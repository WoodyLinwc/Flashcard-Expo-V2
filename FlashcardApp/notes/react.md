# React Native and React and JavaScript

## How to use filter(), map(), reduce(), some() and find() in JavaScript?
```
var officers = [
  { id: 20, name: 'Captain' },
  { id: 24, name: 'General' },
  { id: 56, name: 'Admiral' },
  { id: 88, name: 'Commander' }
];

let highRankingOfficers = officers.filter(officer => officer.id > 50);
// Output: [ { id: 56, name: 'Admiral' }, { id: 88, name: 'Commander' } ]

let officerNames = officers.map(officer => officer.name);
// Output: [ 'Captain', 'General', 'Admiral', 'Commander' ]

const totalYears = officers.reduce((total, officer) => total + officer.years, 0);
// Output: 138
```


## What's the difference between StackNavigationProp and RouteProp?
- StackNavigationProp is about performing navigation actions, while RouteProp is about accessing the current route's parameters. 


## What's React Context?

## Redux vs Context API


## Why do we need onSubmit={e => e.preventDefault()} in a form?
- To prevent the default form submission behavior, which is to reload the page.

## Why all calls to Hook occur before the first return?
- This is because Hooks are called before the component renders, and the component's state and props are used to determine what gets rendered.

## What's DOM(Document Object Model) in React?
- The DOM is an **in-memory representation** of the HTML document. It is not the HTML itself, but rather an API (Application Programming Interface) provided by the browser that allows JavaScript and other scripts to interact with the document.

- After rendering is complete and React updates the DOM, the browser repaints the screen.

## Is JSX(JavaScript XML) same thing as Javascript?
- JSX is a **syntax extension** for JavaScript, and it is not the same thing as JavaScript. JSX is a way to write JavaScript code that looks like HTML, and it is used to describe the structure of a React component.

## What does "rendering generates a snapshot in time" mean?
- This snapshot includes the current values of the component’s state and props. 

- The UI won't change unless the state or props are updated, which triggers another render and produces a new snapshot.


## Why use async and await? When to use them.
- Use async/await when you're handling asynchronous operations (API calls, timeouts, file reading, etc.).
```
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
```



## Why use immer library in React Native?
- **immer** allows you to update immutable data structures (such as state in React) more easily, especially when dealing with deeply nested objects.
```
import { useState } from 'react';
import { useImmer } from 'use-immer';

export default function UserProfile() {

  // const [user, updateUser] = useImmer
  const [user, setUser] = useState({
    name: 'John',
    details: {
      age: 30,
      address: {
        city: 'New York',
        zip: '10001',
      },
    },
  });

  const updateCity = () => {
    setUser({
      ...user,  // Copy the outer user object
      details: {
        ...user.details,  // Copy the details object
        address: {
          ...user.details.address,  // Copy the address object
          city: 'Los Angeles',  // Update the city
        },
      },
    });
  };

  const updateCity = () => {
    updateUser(draft => {
      draft.details.address.city = 'Los Angeles';
    });
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>City: {user.details.address.city}</p>
      <button onClick={updateCity}>Update City</button>
    </div>
  );
}
```