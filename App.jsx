import { useEffect, useState } from "react";
import { registerUser, loginUser, logoutUser, fetchUserItems, addItem } from "./firebase";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Track authentication state
  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setItems(await fetchUserItems(currentUser.uid));
      } else {
        setItems([]);
      }
    });
  }, []);

  // Handle login
  const handleLogin = async () => {
    try {
      await loginUser(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle registration
  const handleRegister = async () => {
    try {
      await registerUser(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logoutUser();
  };

  // Handle adding an item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !user) return alert("Please fill all fields and log in!");

    await addItem(name, price, user.uid);
    setItems(await fetchUserItems(user.uid)); // Refresh list
    setName("");
    setPrice("");
  };

  return (
    <div>
      <h1>🚀 LendIt - Borrow & Lend with Ease 🔥</h1>

      {/* Auth Section */}
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Login / Register</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      )}

      {/* Add Item Form (Only when logged in) */}
      {user && (
        <>
          <h2>Add an Item</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <button type="submit">Add Item</button>
          </form>
        </>
      )}

      {/* Display User's Items */}
      <h2>Your Items</h2>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.Name} - ₹{item.Price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
