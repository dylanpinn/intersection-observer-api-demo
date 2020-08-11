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
          `http://localhost:3000/users?_page=${page}&_limit=40`
        );
        const json = await result.json();

        setUsers((currentUsers) => [...currentUsers, ...json]);
      } catch (e) {
        console.error("Should do something about this: ", e);
      }
    }

    // Simulate time for network request.
    setTimeout(fetchUsers, Math.floor(Math.random() * 1000));
  }, [page]);

  useEffect(() => {
    // Load more once 25% of the target is visible.
    let options = {
      rootMargin: "0px",
      threshold: 0.25,
    };

    /*
     * new IntersectionObserver(callback, options);
     */
    observer.current = new IntersectionObserver((entries) => {
      // entries is an array as can observe multiple elements.
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      });
    }, options);

    const { current: currentObserver } = observer;

    // Watch the pagination sentinel.
    currentObserver.observe(paginationSentinel.current);

    // Cleanup when the component is unmounted.
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
        {users.map((user) => (
          <div key={user.email} className="User">
            <img src={user.image} alt={user.name} />
            <p>{user.name}</p>
            <p>{user.job}</p>
          </div>
        ))}
      </div>

      <div ref={paginationSentinel} className="PaginationSentinel" />
    </div>
  );
}

export default App;
