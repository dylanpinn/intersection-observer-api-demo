import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchUsers() {
      const result = await fetch(`http://localhost:3000/users?_page=${page}`);
      const json = await result.json();

      setUsers((currentUsers) => [...currentUsers, ...json]);
    }

    fetchUsers();
  }, [page]);

  function paginate() {
    setPage((currentPage) => currentPage + 1);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Users</h1>
      </header>

      <div className="Users">
        <ul>
          {users.map((user) => (
            <li key={user.email}>{user.name}</li>
          ))}
        </ul>

        <button onClick={paginate}>Load more</button>
      </div>
    </div>
  );
}

export default App;
