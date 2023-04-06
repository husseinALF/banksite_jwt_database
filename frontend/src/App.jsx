import "./App.css";
import { useState } from "react";
import Login from "./Login";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [money, setMoney] = useState("");

  function handleRegister() {
    const user = {
      username: username,
      password: password,
      amount: money,
    };

    const userString = JSON.stringify(user);

    fetch("http://localhost:3000/users", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: userString,
    }).then((res) => console.log(res));
  }

  return (
    <div className="App">
      <main>
        <h1>Register</h1>
        <label>Username</label>
        <input type="text" onChange={(e) => setUsername(e.target.value)} />
        <label>Password</label>

        <input type="password" onChange={(e) => setPassword(e.target.value)} />

        <label>Input your amount</label>
        <input type="number" onChange={(e) => setMoney(e.target.value)} />

        <button onClick={handleRegister}>Register user</button>
      </main>

      <Login />
    </div>
  );
}

export default App;
