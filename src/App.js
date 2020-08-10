import React, { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const paginationSentinel = useRef();
  const observer = useRef({});

  useEffect(() => {
    async function fetchUsers() {
      const result = await fetch(`http://localhost:3000/users?_page=${page}`);
      const json = await result.json();

      setUsers((currentUsers) => [...currentUsers, ...json]);
    }

    setTimeout(fetchUsers, Math.floor(Math.random() * 1000));
  }, [page]);

  useEffect(() => {
    let options = {
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        console.log(entry);
        if (entry.isIntersecting) {
          paginate();
        }
      });
    }, options);

    const { current: currentObserver } = observer;

    currentObserver.observe(paginationSentinel.current);
  }, []);

  function paginate() {
    setPage((currentPage) => currentPage + 1);
  }

  console.log(observer);

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

        <div ref={paginationSentinel} className="PaginationSentinel" />
        <button onClick={paginate}>Load more</button>
      </div>
    </div>
  );
}

export default App;
