import React, { useReducer, useEffect, useState } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css'
import { Card, Row, Col } from 'react-bootstrap';

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
      <label>
        Number of items to display:
        <input
          type="number"
          value={itemCount}
          onChange={(e) => setItemCount(e.target.value)}
        />
      </label>
      <label>
        Select type:
        <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
          <option value="posts">Posts</option>
          <option value="todos">Todos</option>
          <option value="users">Users</option>
        </select>
      </label>
      {state === null ? <p>Loading...</p> :
        <Row>
          {state.map((item, index) => (
            <Col sm={4} key={index}>
              <Card style={{ width: '18rem', marginTop: '1rem' }}>
                <Card.Body>
                  <Card.Title>{item.title || item.name}</Card.Title>
                  <Card.Text>
                    {renderCardText(item)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      }
    </div>
  );
}

export default App;
