import React, { useReducer, useEffect, useState } from "react";
import "./App.css";
import counterReducer from './reducers/counterReducer';

// Action Types
const SET_ITEMS = "SET_ITEMS";

// Reducer
const itemsReducer = (state, action) => {
  switch (action.type) {
    case SET_ITEMS:
      return action.items;
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(itemsReducer, null);
  const [itemCount, setItemCount] = useState(5);
  const [itemType, setItemType] = useState('posts');
  const [count, countDispatch] = useReducer(counterReducer, 0);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/${itemType}`);

      if (!response.ok) {
        console.error(`API request failed with status ${response.status}`);
        return;
      }

      let items = await response.json();

      if (!Array.isArray(items)) {
        console.error('API response is not an array');
        return;
      }

      // Slice the array of items to desired length
      items = items.slice(0, itemCount);

      dispatch({ type: SET_ITEMS, items });
    };

    fetchItems();
  }, [itemCount, itemType]);

  const renderCardText = (item) => {
    switch(itemType) {
      case 'posts':
        return item.body;
      case 'todos':
        return `Completed: ${item.completed}`;
      case 'users':
        return `Email: ${item.email}`;
      default:
        return '';
    }
  }

  return (
    <div className="App">
      <h1>{itemType.charAt(0).toUpperCase() + itemType.slice(1)}</h1>
      <h2>Count: {count}</h2>
      <div className="button-container">
        <button className="increment-button" onClick={() => countDispatch({ type: 'INCREMENT' })}>
          Increment
        </button>
        <button className="decrement-button" onClick={() => countDispatch({ type: 'DECREMENT' })}>
          Decrement
        </button>
      </div>
      <label>
        Number of items to display:  
        <input
          className="item-count-input"
          type="number"
          value={itemCount}
          onChange={(e) => setItemCount(e.target.value)}
        />
      </label>
      <label>
        Select type:  
        <select className="item-type-select" value={itemType} onChange={(e) => setItemType(e.target.value)}>
          <option value="posts">Posts</option>
          <option value="todos">Todos</option>
          <option value="users">Users</option>
        </select>
      </label>
      {state === null ? <p>Loading...</p> :
        <div className="row">
          {state.map((item, index) => (
            <div className="col-sm-4" key={index}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{item.title || item.name}</h5>
                  <p className="card-text">
                    {renderCardText(item)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

export default App;
