import React, { useState, useEffect} from 'react';
import logo from './logo.svg';
import { API } from 'aws-amplify';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { listTodos } from './graphql/queries';
import { createTodo as createTodoMutation, deleteTodo as deleteTodoMutation } from './graphql/mutations';
import '@aws-amplify/ui-react/styles.css';

const initialFromState = { name: '', description: ''};

function App({ signOut }) {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(initialFromState)

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos });
    setTodos(apiData.data.listTodos.items)
  }

  async function createTodo() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createTodoMutation, variables: { input: formData } });
    setTodos([...todos, formData])
    setFormData(initialFromState);
  }

  async function deleteTodo({ id }) {
    const newTodosArray = todos.filter(todo => todo.id !== id);
    setTodos(newTodosArray);
    await API.graphql({ query: deleteTodoMutation, variables: { input: { id } }});
  }
  return (
    <div className="App">
      <h1>My Todos App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder='Todo name'
        value={formData.name}
      />
      <input
      onChange={e => setFormData({ ...formData, 'description': e.target.value})}
      placeholder='Todo description'
      value={formData.description}
      />

      <button onClick={createTodo}>Create Todo</button>
      <div style={{marginBottm: 30}}>
        {
          todos.map(todo => (
            <div key={todo.id || todo.name}>
              <h2>{todo.name}</h2>
              <p>{todo.description}</p>
              <button onClick={() => deleteTodo(todo)}>Delete todo</button>
            </div>
          ))
        }
      </div>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default withAuthenticator(App);
