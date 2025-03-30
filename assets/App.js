import React, { useState, useEffect } from "react";
import { auth, signInWithGoogle, logout } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to LendIt</h1>
      {user ? (
        <>
          <p>Logged in as: {user.displayName}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={signInWithGoogle}>Login with Google</button>
      )}
    </div>
  );
};

export default App;
