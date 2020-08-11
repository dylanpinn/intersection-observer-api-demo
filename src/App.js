import React, { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const paginationSentinel = useRef();
  const observer = useRef({});

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await fetch(
          `http://localhost:3000/users?_page=${page}&_limit=50`
        );
        const json = await result.json();

        setUsers((currentUsers) => [...currentUsers, ...json]);
      } catch (e) {
        console.error("Should do something about this: ", e);
      }
    }

    setTimeout(fetchUsers, Math.floor(Math.random() * 1000));
  }, [page]);

  useEffect(() => {
    let options = {
      rootMargin: "0px",
      threshold: 0.25,
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      });
    }, options);

    const { current: currentObserver } = observer;

    currentObserver.observe(paginationSentinel.current);

    return () => {
      const { current: currentObserver } = observer;

      currentObserver.unobserve(currentObserver);
    };
  }, []);

  function loadMore() {
    setPage((currentPage) => currentPage + 1);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Users</h1>
      </header>

      <div className="Users">
        <ul style={{ minHeight: "100vh" }}>
          {users.map((user) => (
            <li key={user.email}>{user.name}</li>
          ))}
        </ul>

        <div ref={paginationSentinel} className="PaginationSentinel" />
      </div>
    </div>
  );
}

export default App;
